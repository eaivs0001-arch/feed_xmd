# FEED-XMD command reference

564 commands registered: **422 working**, 109 intentionally disabled, 33 placeholders (registered names with no real behaviour yet).

Default prefix is `/` (change with `.prefix` or `BOT_PREFIX`). `key` = needs an API key (see the dashboard's *API keys* tab — everything else needs none).


## ai (17 working)

- `aiimg` — Generate an AI image from a text prompt (no API key)
- `ask` — Ask real Gemini a question (needs GEMINI_API_KEY in .env — set with .persona) `key: GEMINI_API_KEY`
- `blackbox` — Chat with a free coding-focused AI (no API key)
- `brain` — Alias of .ask — real Gemini API `key: GEMINI_API_KEY`
- `gemini` — Chat with an AI (Gemini-style, free, no API key)
- `gpt` — Chat with a free GPT-style AI (no API key)
- `groq` — Ask Groq (llama-3.3-70b-versatile) a question — needs GROQ_API_KEY in .env `key: GROQ_API_KEY`
- `groqfast` — Ask Groq with the fast llama-3.1-8b-instant model — needs GROQ_API_KEY in .env `key: GROQ_API_KEY`
- `hfchat` — Chat with an open model on Hugging Face — needs HF_TOKEN in .env `key: HF_TOKEN`
- `hfimage` — Generate an image with an open model through Hugging Face Inference Providers `key: HF_TOKEN`
- `imagine` — Alternative AI image generator (no API key)
- `llama` — Chat with a free Llama-style AI (no API key)
- `persona` — Set (or clear) the AI persona for .ask/.brain in this chat (.persona <description> | .persona clear)
- `pimage` — Generate an image with Pollinations AI; supports --model and --size
- `pimodels` — Show available Pollinations models
- `polli` — Pollinations AI text generation
- `pvoice` — Turn text into speech with Pollinations AI `key: POLLINATIONS_API_KEY`

## anime (13 working)

- `anime` — Random anime image (via waifu.pics, no API key)
- `animegif` — Alias of .animegif
- `animegirl` — Get random anime girl images
- `animeimg` — Random anime image (via waifu.pics, no API key)
- `animerand` — Random anime character (via waifu.pics, no API key)
- `animewallpaper` — Get random anime wallpapers
- `awoo` — Awoo (wolf girl) image (via waifu.pics, no API key)
- `gifanime` — Alias of .animegif
- `maid` — Get random maid images
- `megumin` — Get random Megumin images from Konosuba
- `neko` — Get random neko (cat girl) images
- `waifu` — Get random waifu images
- `waifu2` — Waifu image (via waifu.pics, no API key)

## builtin (7 working)

- `base64` — Encode or decode Base64
- `device` — Show runtime/device information
- `hex` — Encode or decode hexadecimal text
- `json` — Validate and pretty-print JSON
- `password` — Generate a strong password
- `timestamp` — Show Unix timestamps
- `uuid` — Generate a random UUID

## convert (8 working)

- `compress` — Reply to an image with .compress to reduce its file size
- `crop` — Reply to an image with .crop to crop it to a square
- `flip` — Reply to an image with .flip <h|v> to mirror it (default h)
- `resize` — Reply to an image with .resize <width> <height>
- `rotate` — Reply to an image with .rotate <degrees> (default 90)
- `toimage` — Convert sticker or video to image
- `tts` — Convert text to speech (audio)
- `vv` — Reply to a view-once photo/video/voice with .vv to reveal it

## core (165 working)

- `about`
- `add`
- `admin`
- `ai`
- `announce`
- `antispam`
- `antispamadd`
- `antispamdisable`
- `antispamenable`
- `antispamlist`
- `antispamremove`
- `api`
- `appearoffline`
- `autoreplydisable`
- `autoreplyenable`
- `availability`
- `backup`
- `balance`
- `ban`
- `bio`
- `blacklist`
- `blocked`
- `broadcast`
- `broadcastall`
- `broadcastgroup`
- `bug`
- `changelog`
- `clear`
- `closepoll` — Alias of pollclose. FEED XMD /pollclose
- `comment`
- `comments`
- `cover`
- `cpu`
- `debug`
- `demote`
- `deposit`
- `disk`
- `dm`
- `dmall`
- `echo`
- `export`
- `farewell`
- `farewelladd`
- `farewelldisable`
- `farewellenable`
- `farewelllist`
- `farewellremove`
- `fav`
- `feedback`
- `filter`
- `follow`
- `followers`
- `following`
- `forwardall`
- `health`
- `help`
- `high5`
- `info`
- `invisible`
- `kick`
- `lang`
- `like`
- `linkallow`
- `linkblacklist`
- `linkblock`
- `linkfilter`
- `linkwhitelist`
- `lockdown`
- `logs`
- `media`
- `memegen`
- `memory`
- `mute`
- `network`
- `offline`
- `online`
- `pin`
- `points`
- `pollclose`
- `pollcreate`
- `pollopen`
- `pollresults`
- `pollvote`
- `privacy`
- `private`
- `profilepic`
- `promote`
- `protected`
- `public`
- `quiz` — Alias of .trivia
- `reaction`
- `reactions`
- `recent`
- `reply`
- `replyall`
- `restore`
- `restrict`
- `roadmap`
- `scandoc`
- `scanimage`
- `scanpdf`
- `scanqr`
- `scantext`
- `scheduled`
- `scheduler`
- `scoreboard`
- `search`
- `secure`
- `server`
- `setcookie`
- `setdesc`
- `setname`
- `setpfp`
- `share`
- `sharecontact`
- `sharefile`
- `sharelocation`
- `slowmode`
- `social`
- `sorry`
- `star`
- `stats`
- `status`
- `suggest`
- `tag`
- `tagall`
- `test`
- `thanks`
- `theme`
- `top`
- `trivia` — A random trivia question from Open Trivia DB (no API key)
- `unban`
- `unblockall`
- `unblockgroup`
- `unblockuser`
- `unfollow`
- `unlike`
- `unlock`
- `unmute`
- `unpin`
- `unrestrict`
- `unstar`
- `untag`
- `uptime`
- `version`
- `viewpoll`
- `votepoll`
- `wall`
- `wallet`
- `wallpost`
- `wallview`
- `websocket`
- `welcomeadd`
- `welcomedisable`
- `welcomeenable`
- `welcomelist`
- `welcomeremove`
- `whitelist`
- `wiki`
- `wink`
- `wordallow`
- `wordblacklist`
- `wordblock`
- `wordfilter`
- `wordwhitelist`

## downloader (21 working)

- `apk` — Download an Android APK by app name (not wired to a backend yet)
- `douyin` — Download a Douyin video by URL (best-effort, no API key)
- `facebook` — Download Facebook videos
- `fb` — Alias of facebook. Download Facebook videos
- `ig` — Alias of instagram. Download Instagram posts, reels, or stories
- `instagram` — Download Instagram posts, reels, or stories
- `pinterest` — Search and download Pinterest images
- `ringtone` — Download a ringtone by name (not wired to a backend yet)
- `soundcloud` — Download SoundCloud tracks
- `spotify` — Download Spotify tracks (search or URL)
- `threads` — Download media from a Threads post URL (best-effort, no API key)
- `tiktok` — Download TikTok videos (no watermark)
- `tt` — Alias of tiktok. Download TikTok videos (no watermark)
- `tw` — Alias of twitter. Download Twitter/X videos
- `twitter` — Download Twitter/X videos
- `web2zip` — Download a webpage as a zip (not wired to a backend yet)
- `yt` — Alias of ytmp4. Download YouTube video as MP4
- `yta` — Alias of ytmp3. Download a YouTube video as MP3 audio
- `ytmp3` — Download a YouTube video as MP3 audio
- `ytmp4` — Download YouTube video as MP4
- `ytv` — Alias of ytmp4. Download YouTube video as MP4

## economy (16 working)

- `bal` — Check your FX balance
- `bet` — Bet FX on a coin flip (.bet <amount> heads|tails)
- `blackjack` — Play a quick simplified round of blackjack (.blackjack <amount>)
- `buy` — Buy an item from the shop
- `daily` — Claim your daily FX bonus (24h cooldown)
- `inventory` — View items you own
- `job` — List available jobs
- `leaderboard` — Show the top FX earners
- `mine` — Mine FX coins (5-min cooldown)
- `register` — Create your FX economy account
- `shop` — View items available for purchase with FX
- `slot` — Play the slot machine with FX (.slot <amount>)
- `transfer` — Send FX to another registered user (reply to their message)
- `use` — Show off (use/display) an owned item in chat
- `weekly` — Claim your weekly FX bonus (7-day cooldown)
- `work` — Work a job for FX (10-min cooldown)

## fun (21 working)

- `8ball` — Ask the Magic 8-Ball a yes/no question
- `bible` — Get a random Bible verse (no API key)
- `compliment` — Give someone a compliment (reply to their message, or leave blank for yourself)
- `cuddle` — cuddle someone (reply to their message; via waifu.pics, no API key)
- `dare` — Get a random dare
- `fact` — Get a random interesting fact
- `horoscope` — Get today's horoscope (.horoscope <sign>)
- `hug` — hug someone (reply to their message; via waifu.pics, no API key)
- `insult` — Playful roast (reply to someone, or leave blank)
- `joke` — Get a random joke
- `kiss` — kiss someone (reply to their message; via waifu.pics, no API key)
- `meme` — Get a random meme from the internet
- `pat` — pat someone (reply to their message; via waifu.pics, no API key)
- `pickup` — Get a random pickup line
- `pokemon` — Look up a Pokémon (.pokemon pikachu) — no API key
- `quote` — Get a random inspirational quote
- `rate` — Rate something out of 10 (.rate <anything>)
- `roast` — Get a random roast to burn someone
- `ship` — Ship two users together (reply to one, mention gives a compatibility %)
- `slap` — slap someone (reply to their message; via waifu.pics, no API key)
- `truth` — Get a random truth question

## games (6 working)

- `animequiz` — Test your anime knowledge!
- `cointoss` — Flip a coin
- `riddle` — Get a random riddle with answer
- `rng` — Random number in a range (.rng <min> <max>)
- `roll` — Roll a dice (.roll [sides], default 6)
- `rps` — Play rock-paper-scissors (.rps rock|paper|scissors)

## group (10 working)

- `groupdesc` — Set the group description (admin only)
- `hidetag` — Mention all members without visibly listing them (admin only)
- `link` — Get the group invite link (admin only)
- `resetwarn` — Clear all warnings for a user (reply to their message, admin only)
- `setgcname` — Set the group name (admin only)
- `setgcpic` — Reply to an image with .setgcpic to set it as the group photo (admin only)
- `setgoodbye` — Set the group goodbye message. Use {user} and {group} placeholders.
- `setwelcome` — Set the group welcome message. Use {user} and {group} placeholders.
- `warn` — Warn a user (reply to their message, admin only). 3 warnings = flagged for removal.
- `warnlist` — View warnings for a user (reply to their message)

## info (18 working)

- `arxiv` — Search arXiv for a research paper (.arxiv quantum computing) — no API key
- `book` — Search for a book (.book <title>)
- `color` — Get info about a hex color (.color ff5733)
- `covid` — Get COVID-19 stats for a country (.covid USA), or global
- `crypto` — Get a cryptocurrency price (.crypto bitcoin)
- `dadjoke` — Get a random dad joke
- `date` — Show the current server date and time
- `funfact` — Get a random fun fact
- `google` — Search Google and get top results
- `hackernews` — Search Hacker News stories (.hackernews AI) — no API key
- `lyrics` — Get lyrics for any song
- `movie` — Look up a movie (.movie <title>) — richer results if OMDB_API_KEY is set `key: OMDB_API_KEY`
- `pinsearch` — Search Pinterest images by keyword (best-effort, no API key)
- `stock` — Get a stock quote (.stock AAPL) — needs ALPHAVANTAGE_API_KEY in .env `key: ALPHAVANTAGE_API_KEY`
- `timezone` — Show the current time in a timezone (.timezone Asia/Tokyo)
- `tv` — Alias of .movie for TV shows
- `weather` — Get current weather for any city
- `wikipedia` — Search Wikipedia for any topic

## main (22 working)

- `chr` — Count characters, words, and lines in text
- `fancy` — Alias of .font — convert text into fancy unicode fonts
- `font` — Convert text into fancy unicode fonts
- `forward` — Reply to a message with .forward <jid> to forward it elsewhere
- `getdp` — Get profile picture of a user or group
- `hn` — Alias of .hackernews
- `jid` — Get the JID (ID) of the current chat
- `level` — Alias of .profile — check your level and XP
- `menu` — Show the FEED XMD menu
- `owner` — Get contact info for the bot owner
- `ping` — Check bot latency
- `profile` — Show your level, XP, and balance
- `rank` — Show your rank among registered users
- `readmore` — Send text with a WhatsApp-style "Read more" fold
- `runtime` — Show bot uptime
- `save` — Reply to an image/video/audio with .save to get it back as a raw file
- `send` — Send a text message to a JID via the bot (owner only)
- `system` — Show system information
- `telegram` — Get FEED XMD Telegram channel info `key: TELEGRAM_BOT_TOKEN`
- `tourl` — Alias of .upload — reply to media to get a direct link
- `upload` — Reply to media with .upload to get a shareable direct link (via 0x0.st)
- `winfo` — Get WhatsApp account info

## news (8 working)

- `bbcnews` — BBC World News `key: GEMINI_API_KEY`
- `derana` — Ada Derana — Sri Lanka `key: GEMINI_API_KEY`
- `intlnews` — International News (BBC) `key: GEMINI_API_KEY`
- `lankadeepa` — Lankadeepa — Sri Lanka (Sinhala)
- `news` — Top Headlines (BBC)
- `newsfirst` — NewsFirst — Sri Lanka
- `sinhalanda` — Sinhala News Aggregate
- `worldnews` — World News (BBC)

## open (2 working)

- `forecast` — Open-Meteo forecast with no API key
- `github` — Get public GitHub repository information

## owner (7 working)

- `bc` — Broadcast a message to all registered users (owner only)
- `block` — Block a user (reply to their message, owner only)
- `botinfo` — Show bot information and stats
- `deleteme` — Delete the bot's recent messages in this chat (reply to bot message, owner only)
- `join` — Join a group via invite link (owner only)
- `leave` — Make the bot leave the current group (owner only)
- `unblock` — Unblock a user by JID (owner only)

## search (8 working)

- `cat` — Get random cat images
- `country` — Look up a country (.country Japan) — no API key
- `define` — Look up a word: definitions, phonetics and synonyms (no API key)
- `dog` — Get random dog images
- `image` — Search images on Google
- `synonym` — Find synonyms for a word (no API key)
- `ttsearch` — Search TikTok videos by keyword (best-effort, no API key)
- `wallpaper` — Get a wallpaper matching a keyword — real photos if UNSPLASH_API_KEY is set, otherwise an AI image

## security (9 working)

- `antigroupmention` — Toggle blocking messages that @mention the whole group (admin only)
- `antisticker` — Toggle blocking of stickers in this group (admin only)
- `autoreplyadd` — Add an auto-reply rule (.autoreplyadd <trigger> | <response>)
- `autoreplylist` — List all auto-reply rules
- `autoreplyremove` — Remove an auto-reply rule by trigger (.autoreplyremove <trigger>)
- `filteradd` — Add a word to the group's blocked-word filter (admin only)
- `filterlist` — Show the group's blocked-word filter list
- `filterremove` — Remove a word from the group's blocked-word filter (admin only)
- `security` — Show the current security settings for this group

## settings (28 working)

- `alwaysoffline` — Force the bot presence to always show offline (owner only)
- `alwaysonline` — Force the bot presence to always show online (owner only)
- `antibad` — Toggle anti-bad-words filter for this group (admin only)
- `antibot` — Toggle anti-bot (block other bots) for this group (admin only)
- `anticall` — Toggle anti-call (auto-reject calls) for this group (admin only)
- `antiedit` — Toggle anti-edit tracking for this group (admin only)
- `antilink` — Toggle anti-link protection for this group (admin only)
- `antilinkaction` — Set the action taken when anti-link is triggered (admin only)
- `antimention` — Toggle anti-mention (block mass @mentions) for this group (admin only)
- `autoai` — Toggle auto AI chat replies bot-wide (owner only)
- `autobio` — Toggle auto-updating bio bot-wide (owner only)
- `autolike` — Toggle auto-like of statuses bot-wide (owner only)
- `autoreact` — Toggle auto-react to messages bot-wide (owner only)
- `autoread` — Toggle auto-read of messages bot-wide (owner only)
- `autorecording` — Toggle always-recording presence bot-wide (owner only)
- `autoreply` — Toggle auto-reply to DMs bot-wide (owner only)
- `autoreplytext` — Set the custom text used for auto-reply (owner only)
- `autotyping` — Toggle always-typing presence bot-wide (owner only)
- `autoview` — Toggle auto-view of statuses bot-wide (owner only)
- `autovoice` — Toggle auto voice-note replies bot-wide (owner only)
- `footer` — Change the menu footer text (owner only)
- `gcstatus` — Show basic status info for this group
- `goodbye` — Toggle goodbye messages for this group (admin only)
- `mode` — Toggle bot between public and private mode (owner only)
- `name` — Change the bot display name (owner only)
- `prefix` — Change the bot command prefix (owner only)
- `readcmdonly` — Toggle commands-only read mode bot-wide (owner only)
- `welcome` — Toggle welcome messages for this group (admin only)

## tools (16 working)

- `calc` — Evaluate a math expression (.calc 2+2*3)
- `currency` — Convert currency (e.g., USD to NGN)
- `decrypt` — Decrypt text produced by .encrypt (.decrypt <passphrase> <payload>)
- `encrypt` — Encrypt text with a passphrase (.encrypt <passphrase> <text>)
- `hash` — Hash text (.hash <md5|sha1|sha256> <text>)
- `poll` — Create a poll (.poll Question? | Option1 | Option2 | ...)
- `qr` — Generate a QR code from text (.qr <text>)
- `qrscan` — Reply to an image containing a QR code with .qrscan to decode it
- `shorturl` — Shorten a long URL
- `ssweb` — Take a screenshot of any website
- `sticker` — Reply to an image or short video with .sticker to convert it
- `tr` — Alias of .translate
- `translate` — Translate text (.translate <lang-code> <text>, e.g. .translate es Hello)
- `unit` — Convert units (.unit 10 km to mi)
- `voice` — Reply to a voice note with .voice <deep|high> to change its pitch
- `vote` — Alias of .poll — create a poll

## utility (20 working)

- `archive` — Archive this chat
- `contacts` — List group participants (in groups only)
- `delremind` — Cancel a reminder by id (.delremind <id>)
- `deltodo` — Delete a to-do item by id (.deltodo <id>)
- `done` — Mark a to-do item as done (.done <id>)
- `groupinfo` — Show detailed info about the current group
- `groups` — List groups the bot has settings stored for (owner only)
- `mutechat` — Mute notifications for this chat (8 hours)
- `myreminders` — List your pending reminders in this chat
- `mytodo` — List your to-do items
- `pinmessage` — Pin a message in this chat (reply to it, admin only in groups)
- `react` — React to a message with an emoji (reply to it: .react 🔥)
- `remind` — Set a reminder (.remind 10m Check the oven)
- `timer` — Set a countdown timer (.timer 5m Take the food out)
- `todo` — Add a to-do item (.todo <task>)
- `unarchive` — Unarchive this chat
- `unmutechat` — Unmute notifications for this chat
- `unpinmessage` — Unpin a message in this chat (reply to it, admin only in groups)
- `userinfo` — Alias of .whois
- `whois` — Show basic info about a user (reply to their message)

## Intentionally disabled
`backupall`, `backupchat`, `backupgroup`, `backupsession`, `bypass`, `bypassall`, `bypasschat`, `bypassgroup`, `bypasssession`, `clean`, `cleanall`, `cleanchat`, `cleangroup`, `cleansession`, `clearchat`, `clone`, `clonechat`, `clonegroup`, `clonesession`, `deleteall`, `deleteuser`, `fix`, `fixchat`, `fixgroup`, `fixsession`, `force`, `forceall`, `forcechat`, `forcegroup`, `forcesession`, `kill`, `killall`, `killchat`, `killgroup`, `killsession`, `mirror`, `mirrorchat`, `mirrorgroup`, `optimize`, `optimizechat`, `optimizegroup`, `optimizesession`, `override`, `overrideall`, `overridechat`, `overridegroup`, `overridesession`, `purge`, `purgeall`, `purgechat`, `purgegroup`, `purgesession`, `refresh`, `refreshall`, `refreshchat`, `refreshgroup`, `refreshsession`, `reload`, `reloadall`, `reloadchat`, `reloadgroup`, `reloadsession`, `remote`, `remotebroadcast`, `remotectl`, `remoteview`, `repair`, `repairchat`, `repairgroup`, `repairsession`, `reset`, `resetall`, `resetchat`, `resetgroup`, `resetsession`, `restartall`, `restartchat`, `restartgroup`, `restartsession`, `restoreall`, `restorechat`, `restoregroup`, `restoresession`, `start`, `startall`, `startchat`, `startgroup`, `startsession`, `stop`, `stopall`, `stopchat`, `stopgroup`, `stopsession`, `sync`, `syncall`, `syncchat`, `syncgroup`, `syncsession`, `terminate`, `terminateall`, `terminatechat`, `terminategroup`, `terminatesession`, `tglogs`, `wipe`, `wipeall`, `wipechat`, `wipegroup`, `wipesession`

## Placeholders (registered, not implemented)
`achievements`, `activity`, `addcart`, `badges`, `cart`, `checkout`, `chess`, `deletepoll`, `dnd`, `donate`, `edit`, `exportcontacts`, `feed`, `groupsstats`, `import`, `invite`, `is`, `muteall`, `notify`, `order`, `orders`, `pay`, `pinlist`, `pinned`, `product`, `removecart`, `spack`, `stext`, `stickerpack`, `tictac`, `unmuteall`, `withdraw`, `xmd`
