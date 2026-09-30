// ============================================
//   FEED XMD - WhatsApp Bot
//   Entry point: connection + command routing
// ============================================

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode-terminal');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const { loadCommands } = require('./scr/commands/index');
const { readDB, writeDB } = require('./scr/lib/database/db');
const { initReminders } = require('./scr/lib/utils/reminderScheduler');
const { AUTH_DIR, inc } = require('./scr/lib/utils/runtime');
const { startDashboardAPI } = require('./scr/lib/dashboard/server');
const { logBotEvent, logNewUser, logCommand } = require('./scr/lib/utils/telegramLogger');
const { startSelfPing } = require('./scr/lib/utils/selfPing');

// ==============================
//  CONFIGURATION
// ==============================
const BOT_NAME = process.env.BOT_NAME || 'FEED XMD';
const OWNER = process.env.OWNER_NAME || 'FEED';
const OWNER_NUMBER = process.env.OWNER_NUMBER || '';

function getPrefix() {
    const settings = readDB('settings');
    return settings.prefix || process.env.BOT_PREFIX || process.env.PREFIX || '/';
}

// ==============================
//  COMMAND REGISTRY
// ==============================
let commandRegistry = loadCommands();
let activeSocket = null;
const botState = {
    status: 'initializing',
    qr: null,
    reconnectAttempt: 0,
    healthProbeFailures: 0,
    lastConnectionUpdate: null
};

// Simple per-user rate limiting
const rateLimits = new Map();
function isRateLimited(jid) {
    const now = Date.now();
    const entry = rateLimits.get(jid) || { count: 0, windowStart: now };
    if (now - entry.windowStart > 60000) {
        entry.count = 0;
        entry.windowStart = now;
    }
    entry.count++;
    rateLimits.set(jid, entry);
    return entry.count > Number(process.env.RATE_LIMIT_PER_MINUTE || 20);
}

function unwrapMessage(message) {
    if (message?.ephemeralMessage?.message) return unwrapMessage(message.ephemeralMessage.message);
    if (message?.viewOnceMessage?.message) return unwrapMessage(message.viewOnceMessage.message);
    if (message?.viewOnceMessageV2?.message) return unwrapMessage(message.viewOnceMessageV2.message);
    if (message?.documentWithCaptionMessage?.message) return unwrapMessage(message.documentWithCaptionMessage.message);
    return message || {};
}

function getMessageText(msg) {
    const m = unwrapMessage(msg.message);
    return m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        m.videoMessage?.caption ||
        m.documentMessage?.caption ||
        '';
}

function parseArgs(value) {
    const out = [];
    const re = /\"([^\"]*)\"|'([^']*)'|(\S+)/g;
    let match;
    while ((match = re.exec(value))) out.push(match[1] ?? match[2] ?? match[3]);
    return out;
}

function containsLink(text) {
    return /(https?:\/\/|chat\.whatsapp\.com|www\.)/i.test(text);
}

// ==============================
//  COMMAND HANDLER
// ==============================
async function handleCommand(sock, msg, text, prefix) {
    const remoteJid = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.key.remoteJid;

    const withoutPrefix = text.slice(prefix.length).trim();
    const [cmdName, ...args] = parseArgs(withoutPrefix);
    const command = commandRegistry.get(cmdName.toLowerCase());

    if (!command) return;

    if (isRateLimited(senderJid)) {
        return sock.sendMessage(remoteJid, { text: '⏳ Slow down — too many commands. Try again in a moment.' });
    }

    // Track distinct users (for the dashboard and Telegram "new user" alerts)
    const users = readDB('users');
    if (!users[senderJid]) {
        users[senderJid] = { firstSeen: new Date().toISOString(), commands: 0 };
        writeDB('users', users);
        logNewUser(senderJid, msg.pushName);
    }
    users[senderJid].commands = (users[senderJid].commands || 0) + 1;
    users[senderJid].lastSeen = new Date().toISOString();
    writeDB('users', users);

    inc('commands');
    console.log(`[CMD] ${moment().format('HH:mm:ss')} ${prefix}${cmdName} from ${senderJid}`);
    logCommand(senderJid, remoteJid, cmdName, msg.pushName);

    try {
        await command.execute(sock, msg, args, commandRegistry);
    } catch (err) {
        console.error(`[CMD] Error in ${cmdName}:`, err);
        await sock.sendMessage(remoteJid, { text: `❌ Something went wrong running *${cmdName}*.` }).catch(() => {});
    }
}

// ==============================
//  GROUP EVENT HANDLERS
// ==============================
function wireGroupEvents(sock) {
    sock.ev.on('group-participants.update', async (update) => {
        const { id: groupId, participants, action } = update;
        const groups = readDB('groups');
        const settings = groups[groupId];
        if (!settings) return;

        for (const participant of participants) {
            const name = `@${participant.split('@')[0]}`;
            if (action === 'add' && settings.welcome && settings.welcomeMessage) {
                const text = settings.welcomeMessage
                    .replace('{user}', name)
                    .replace('{group}', '');
                await sock.sendMessage(groupId, { text, mentions: [participant] }).catch(() => {});
            }
            if (action === 'remove' && settings.goodbye && settings.goodbyeMessage) {
                const text = settings.goodbyeMessage
                    .replace('{user}', name)
                    .replace('{group}', '');
                await sock.sendMessage(groupId, { text, mentions: [participant] }).catch(() => {});
            }
        }
    });
}

function wireAntiLink(sock) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        inc('messages');
        if (!msg?.message || msg.key.fromMe) return;
        const groupId = msg.key.remoteJid;
        if (!groupId.endsWith('@g.us')) return;

        const groups = readDB('groups');
        const settings = groups[groupId];
        if (!settings?.antilink) return;

        const text = getMessageText(msg);
        if (!text || !containsLink(text)) return;

        try {
            const metadata = await sock.groupMetadata(groupId);
            const sender = msg.key.participant || msg.key.remoteJid;
            const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;
            if (isAdmin) return;

            const action = settings.antilinkAction || 'delete';
            if (action === 'delete' || action === 'kick') {
                await sock.sendMessage(groupId, { delete: msg.key }).catch(() => {});
            }
            if (action === 'kick') {
                await sock.groupParticipantsUpdate(groupId, [sender], 'remove').catch(() => {});
            }
            await sock.sendMessage(groupId, {
                text: `🔗 *Anti-Link*\n@${sender.split('@')[0]}'s message was removed for containing a link.`,
                mentions: [sender]
            });
        } catch (err) {
            console.error('[AntiLink] Error:', err.message);
        }
    });
}

function wireWordFilter(sock) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        inc('messages');
        if (!msg?.message || msg.key.fromMe) return;
        const groupId = msg.key.remoteJid;
        if (!groupId.endsWith('@g.us')) return;

        const groups = readDB('groups');
        const wordFilter = groups[groupId]?.wordFilter;
        if (!wordFilter?.length) return;

        const text = getMessageText(msg).toLowerCase();
        if (!text) return;
        const hit = wordFilter.find(w => text.includes(w));
        if (!hit) return;

        try {
            const sender = msg.key.participant || msg.key.remoteJid;
            await sock.sendMessage(groupId, { delete: msg.key }).catch(() => {});
            await sock.sendMessage(groupId, {
                text: `🚫 A message from @${sender.split('@')[0]} was removed for containing a filtered word.`,
                mentions: [sender]
            });
        } catch (err) {
            console.error('[WordFilter] Error:', err.message);
        }
    });
}

function wireAutoReply(sock) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        inc('messages');
        if (!msg?.message || msg.key.fromMe) return;

        const settings = readDB('settings');
        if (!settings.autoreply) return;

        const rules = settings.autoreplyRules || {};
        const text = getMessageText(msg).toLowerCase();
        if (!text) return;

        for (const [trigger, response] of Object.entries(rules)) {
            if (text.includes(trigger)) {
                await sock.sendMessage(msg.key.remoteJid, { text: response }).catch(() => {});
                break;
            }
        }
    });
}

// ==============================
//  BOT START
// ==============================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        browser: [BOT_NAME, 'Chrome', '2.0.0']
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        botState.lastConnectionUpdate = new Date().toISOString();

        if (qr) {
            botState.status = 'qr';
            botState.qr = qr;
            console.log('📱 Scan this QR code with WhatsApp (or open the web dashboard):');
            QRCode.generate(qr, { small: true });
        }

        if (connection === 'connecting') {
            botState.status = 'connecting';
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error instanceof Boom) ? lastDisconnect.error.output?.statusCode : null;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            botState.status = shouldReconnect ? 'connecting' : 'logged-out';
            botState.qr = null;
            console.log('🔄 Connection closed.', shouldReconnect ? 'Reconnecting...' : 'Logged out — delete ./auth and re-pair.');
            logBotEvent(shouldReconnect ? 'Connection lost — reconnecting…' : 'Logged out. Needs re-pairing.');
            if (shouldReconnect) {
                botState.reconnectAttempt += 1;
                setTimeout(() => startBot().catch(err => {
                    botState.healthProbeFailures += 1;
                    console.error('[BOT] reconnect failed:', err.message);
                }), 3000);
            }
        }

        if (connection === 'open') {
            botState.status = 'open';
            botState.qr = null;
            botState.reconnectAttempt = 0;
            console.log(`✅ ${BOT_NAME} is online. Owner: ${OWNER}. Prefix: ${getPrefix()}. Commands: ${commandRegistry.size}.`);
            logBotEvent(`Logged in as ${sock.user?.id?.split(':')[0] || 'unknown number'} (${sock.user?.name || 'no name'}). ${commandRegistry.size} commands loaded.`);
            initReminders(sock);
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        inc('messages');
        if (!msg?.message || msg.key.fromMe) return;

        const text = getMessageText(msg);
        const prefix = getPrefix();
        if (text && text.startsWith(prefix)) {
            await handleCommand(sock, msg, text, prefix);
        }
    });

    wireGroupEvents(sock);
    wireAntiLink(sock);
    wireWordFilter(sock);
    wireAutoReply(sock);

    sock.ev.on('creds.update', saveCreds);
    activeSocket = sock;
    return sock;
}

// ==============================
//  START
// ==============================
console.log('🚀 Booting FEED XMD...');
startDashboardAPI(() => activeSocket, () => botState);
startSelfPing();
startBot().then(sock => { activeSocket = sock; }).catch(err => { console.error('❌ Fatal startup error:', err); process.exitCode = 1; });
/* legacy startup handled above */
/*.catch(err => { console.error('❌ Fatal startup error:', err); process.exitCode = 1; });
*/
console.log(`📦 ${commandRegistry.size} commands loaded ("bugs" category intentionally disabled).`);

