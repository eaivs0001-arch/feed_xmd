#!/usr/bin/env bash
set -euo pipefail
if [ ! -d node_modules ]; then npm install --no-audit --no-fund; fi
npm start
