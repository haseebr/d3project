# Plan: Setup OpenClaw Repo (Clone & Run)

## Context
The existing `d3project` repo contains an old D3/React Bitcoin price visualization app that is no longer needed. The goal is to replace all repo contents with a fully configured OpenClaw setup that anyone can clone and immediately run with Docker Compose. OpenClaw is an open-source AI agent framework connecting LLMs to messaging platforms.

**User preferences:** Telegram channel · Anthropic Claude (claude-sonnet-4-6) · Docker Compose

---

## Step 1: Delete Everything
Remove all existing files from the repo root (keeping `.git`):
- `index.js`, `db.js`, `retrieve.js`, `utils.js`
- `src/` directory, `dist/` directory
- `webpack.config.js`, `.eslintrc.json`, `.projectile`, `.tern-project`, `.tern-port`
- `package.json`, `README.md`, `node_modules/`

---

## Step 2: Files to Create

### `docker-compose.yml`
Based on OpenClaw's official structure, using pre-built image (`ghcr.io/openclaw/openclaw:latest` via `OPENCLAW_IMAGE` env var) to avoid a 2GB build. Two services:
- **`openclaw-gateway`**: Long-running gateway server (port 18789 UI, 18790 bridge)
- **`openclaw-cli`**: One-off CLI for onboarding/management

Volumes:
- `${OPENCLAW_CONFIG_DIR:-./config}:/home/node/.openclaw` — config dir (maps to `./config/`)
- `${OPENCLAW_WORKSPACE_DIR:-./workspace}:/home/node/.openclaw/workspace` — agent workspace

Environment variables passed from `.env`:
- `ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`
- `OPENCLAW_IMAGE`, `OPENCLAW_TZ`, `OPENCLAW_GATEWAY_TOKEN`
- `HOME: /home/node`, `TERM: xterm-256color`

### `config/openclaw.json`
Pre-configured JSON5 config (committed to repo as a template):
```json5
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-6"
      },
      "workspace": "~/.openclaw/workspace"
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "dmPolicy": "allowlist",
      "allowFrom": []  // Add your Telegram numeric user ID here
    }
  },
  "sessions": {
    "scope": "per-peer",
    "resetOnKeyword": ["reset", "start over", "/reset"]
  }
}
```

### `.env.example`
```
# Copy to .env and fill in your values
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=123456789:ABC...

# Optional: use pre-built image (recommended, avoids 2GB build)
OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest

# Optional: timezone (default: UTC)
OPENCLAW_TZ=UTC
```

### `.gitignore`
```
.env
workspace/
config/state/
*.log
```

### `setup.sh`
Convenience script that:
1. Checks `.env` exists (errors if not)
2. Creates `workspace/` dir if missing
3. Runs `docker compose run --rm openclaw-cli onboard`
4. Runs `docker compose up -d openclaw-gateway`
5. Prints the Control UI URL

### `README.md`
Clear quickstart with:
1. **Prerequisites**: Docker (≥2GB RAM), Telegram bot token (via @BotFather), Anthropic API key
2. **Setup**: `git clone` → `cp .env.example .env` → fill secrets → `chmod +x setup.sh && ./setup.sh`
3. **Verify**: `curl http://localhost:18789/healthz` → open `http://localhost:18789`
4. **Add yourself**: Edit `config/openclaw.json`, add your Telegram numeric user ID to `allowFrom`
5. **Managing**: `docker compose logs -f`, `docker compose down`, `docker compose pull && docker compose up -d`

---

## Step 3: Git Operations
1. Stage all deletions and new files
2. Commit: `"Setup fully configured OpenClaw repo with Docker Compose, Telegram, and Claude"`
3. Push to `claude/setup-openclaw-repo-shpzg`

---

## Verification (after cloning)
```bash
cp .env.example .env          # fill ANTHROPIC_API_KEY and TELEGRAM_BOT_TOKEN
./setup.sh                    # installs and starts OpenClaw
curl http://localhost:18789/healthz   # should return {"status":"ok"}
# Open http://localhost:18789 — Control UI loads
# Message your Telegram bot — Claude responds
```
