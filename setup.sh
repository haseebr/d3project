#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# OpenClaw Setup Script
# Usage: ./setup.sh
# ============================================================

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log()   { echo -e "${GREEN}[setup]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
error() { echo -e "${RED}[error]${NC} $*"; exit 1; }

echo -e "${BOLD}OpenClaw Setup${NC}"
echo "================================"

# --- Check prerequisites ---

command -v docker >/dev/null 2>&1 || error "Docker is not installed. See https://docs.docker.com/get-docker/"
docker compose version >/dev/null 2>&1 || error "Docker Compose v2 is required. See https://docs.docker.com/compose/install/"

# --- Check .env ---

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    warn ".env not found. Copying .env.example to .env ..."
    cp .env.example .env
    echo ""
    echo -e "${YELLOW}ACTION REQUIRED:${NC} Edit .env and fill in your API keys:"
    echo "  ANTHROPIC_API_KEY  — get from https://console.anthropic.com"
    echo "  TELEGRAM_BOT_TOKEN — get from @BotFather on Telegram"
    echo ""
    echo "Then re-run: ./setup.sh"
    exit 1
  else
    error ".env file not found. Please create it from .env.example"
  fi
fi

# Validate required vars
source .env
[ -z "${ANTHROPIC_API_KEY:-}" ] && error "ANTHROPIC_API_KEY is not set in .env"
[ -z "${TELEGRAM_BOT_TOKEN:-}" ] && error "TELEGRAM_BOT_TOKEN is not set in .env"

# --- Create workspace directory ---

mkdir -p workspace
log "workspace/ directory ready"

# --- Pull latest image ---

OPENCLAW_IMAGE="${OPENCLAW_IMAGE:-ghcr.io/openclaw/openclaw:latest}"
log "Pulling image: $OPENCLAW_IMAGE ..."
docker pull "$OPENCLAW_IMAGE"

# --- Run onboarding (first-time setup) ---

if [ ! -f "config/state/onboarded" ]; then
  log "Running first-time onboarding ..."
  docker compose --profile cli run --rm openclaw-cli onboard --non-interactive || true
  mkdir -p config/state && touch config/state/onboarded
fi

# --- Start gateway ---

log "Starting OpenClaw gateway ..."
docker compose up -d openclaw-gateway

# --- Wait for health ---

log "Waiting for gateway to be healthy ..."
for i in $(seq 1 20); do
  if curl -fsS http://127.0.0.1:18789/healthz >/dev/null 2>&1; then
    echo ""
    log "OpenClaw is running!"
    echo ""
    echo -e "${BOLD}Control UI:${NC} http://localhost:18789"
    echo ""
    echo -e "${BOLD}Next step:${NC} Add your Telegram user ID to config/openclaw.json"
    echo "  1. Get your ID by messaging @userinfobot on Telegram"
    echo "  2. Edit config/openclaw.json → add your ID to channels.telegram.allowFrom"
    echo "  3. Run: docker compose restart openclaw-gateway"
    echo ""
    echo "Useful commands:"
    echo "  docker compose logs -f openclaw-gateway   # view logs"
    echo "  docker compose down                        # stop"
    echo "  docker compose pull && ./setup.sh          # update"
    exit 0
  fi
  sleep 1
done

warn "Gateway may still be starting. Check logs with: docker compose logs openclaw-gateway"
