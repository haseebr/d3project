# OpenClaw — Self-Hosted AI Agent

A fully configured [OpenClaw](https://openclaw.ai) setup running on Docker Compose.

**Stack:** Telegram · Anthropic Claude (claude-sonnet-4-6) · Docker Compose

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Docker](https://docs.docker.com/get-docker/) + Compose v2 | Min. 2 GB RAM |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) |
| Telegram bot token | Create via [@BotFather](https://t.me/BotFather) → `/newbot` |

---

## Quickstart

```bash
# 1. Clone
git clone <repo-url>
cd <repo-dir>

# 2. Configure secrets
cp .env.example .env
# Edit .env — fill in ANTHROPIC_API_KEY and TELEGRAM_BOT_TOKEN

# 3. Start
./setup.sh
```

Control UI opens at **http://localhost:18789**

---

## Add Yourself to the Allowlist

By default the bot rejects all DMs (allowlist mode). To allow your Telegram account:

1. Get your numeric Telegram user ID from [@userinfobot](https://t.me/userinfobot)
2. Edit `config/openclaw.json` → add your ID to `channels.telegram.allowFrom`:
   ```json
   "allowFrom": [123456789]
   ```
3. Restart: `docker compose restart openclaw-gateway`

---

## File Structure

```
.
├── docker-compose.yml      # Service definitions
├── setup.sh                # One-command bootstrap
├── .env.example            # Environment variable template
├── .gitignore
├── config/
│   └── openclaw.json       # OpenClaw configuration (Telegram + Claude)
└── workspace/              # Agent sandbox (git-ignored, runtime only)
```

---

## Configuration

All agent/channel settings live in `config/openclaw.json`.

Key sections:

| Section | What it controls |
|---------|-----------------|
| `agents.defaults.model` | LLM model (`anthropic/claude-sonnet-4-6`) |
| `channels.telegram` | Bot token, DM access control, streaming mode |
| `sessions` | Conversation scope and reset keywords |

Full reference: [docs.openclaw.ai/gateway/configuration](https://docs.openclaw.ai/gateway/configuration)

---

## Common Commands

```bash
# View live logs
docker compose logs -f openclaw-gateway

# Stop
docker compose down

# Update to latest image
docker compose pull && docker compose up -d

# Run CLI commands (onboarding, diagnostics, etc.)
docker compose --profile cli run --rm openclaw-cli <command>

# Check health
curl http://localhost:18789/healthz
```

---

## Ports

| Port | Purpose |
|------|---------|
| `18789` | Control UI + HTTP API |
| `18790` | WebSocket bridge |

---

## Troubleshooting

**Bot doesn't respond to messages**
- Check your user ID is in `allowFrom` in `config/openclaw.json`
- Verify `TELEGRAM_BOT_TOKEN` is correct in `.env`
- Check logs: `docker compose logs openclaw-gateway`

**Container exits immediately**
- Ensure `ANTHROPIC_API_KEY` and `TELEGRAM_BOT_TOKEN` are set in `.env`
- System needs at least 2 GB RAM for the image

**Port already in use**
- Change host ports in `docker-compose.yml` (e.g. `"19789:18789"`)
