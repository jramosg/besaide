#!/bin/bash
# Log viewing utility for VPS and local development

# Detect environment
if [ -f "$HOME/besaide/docker-compose.prod.yml" ]; then
  # Production VPS
  COMPOSE_FILE="$HOME/besaide/docker-compose.prod.yml"
  LOGS_DIR="$HOME/besaide/logs"
else
  # Local development - assume we're in the project directory
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
  COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
  LOGS_DIR="$PROJECT_DIR/logs"
fi

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

case "$1" in
  tail|follow)
    echo "Following application logs (Ctrl+C to stop)..."
    # pino-roll creates app.1.log for the worker thread
    if [ -f "$LOGS_DIR/app.1.log" ]; then
      tail -f "$LOGS_DIR/app.1.log"
    elif [ -f "$LOGS_DIR/app.log" ]; then
      tail -f "$LOGS_DIR/app.log"
    else
      echo "No log file found. Expected: $LOGS_DIR/app.log or $LOGS_DIR/app.1.log"
      exit 1
    fi
    ;;

  node)
    echo "Following Node.js container logs (Ctrl+C to stop)..."
    docker compose -f "$COMPOSE_FILE" logs -f --tail=100 node
    ;;

  nginx)
    echo "Following Nginx container logs (Ctrl+C to stop)..."
    docker compose -f "$COMPOSE_FILE" logs -f --tail=100 nginx
    ;;

  all)
    echo "Following all container logs (Ctrl+C to stop)..."
    docker compose -f "$COMPOSE_FILE" logs -f --tail=100
    ;;

  search)
    if [ -z "$2" ]; then
      echo "Usage: ./logs.sh search <pattern> [lines]"
      exit 1
    fi
    LINES="${3:-50}"
    LOG_FILE="$LOGS_DIR/app.1.log"
    [ ! -f "$LOG_FILE" ] && LOG_FILE="$LOGS_DIR/app.log"
    echo "Searching last $LINES lines for: $2"
    tail -n "$LINES" "$LOG_FILE" | grep -i --color=always "$2"
    ;;

  errors)
    echo -e "${RED}Errors and warnings from application logs:${NC}"
    LOG_FILE="$LOGS_DIR/app.1.log"
    [ ! -f "$LOG_FILE" ] && LOG_FILE="$LOGS_DIR/app.log"
    tail -n 100 "$LOG_FILE" | grep -E '"level":"(error|warn)"' --color=always
    ;;

  json)
    if command -v jq &> /dev/null; then
      echo "Pretty-printing application logs (last 20 entries)..."
      LOG_FILE="$LOGS_DIR/app.1.log"
      [ ! -f "$LOG_FILE" ] && LOG_FILE="$LOGS_DIR/app.log"
      tail -n 20 "$LOG_FILE" | jq .
    else
      echo "jq is not installed. Install with: sudo apt-get install jq"
      exit 1
    fi
    ;;

  stats)
    echo "Log statistics:"
    echo "----------------"
    LOG_FILE="$LOGS_DIR/app.1.log"
    [ ! -f "$LOG_FILE" ] && LOG_FILE="$LOGS_DIR/app.log"

    if [ -f "$LOG_FILE" ]; then
      echo "Current log file: $(basename "$LOG_FILE")"
      echo "File size: $(du -h "$LOG_FILE" | cut -f1)"
      echo "Total log entries: $(wc -l < "$LOG_FILE")"
      echo "Error count: $(grep -c '"level":"error"' "$LOG_FILE" 2>/dev/null || echo 0)"
      echo "Warning count: $(grep -c '"level":"warn"' "$LOG_FILE" 2>/dev/null || echo 0)"
      echo ""
      echo "All log files:"
      ls -lh "$LOGS_DIR"
    else
      echo "No log file found at $LOGS_DIR/"
      echo "Expected: app.log or app.1.log"
    fi
    ;;

  clean)
    echo -e "${YELLOW}Cleaning old log files...${NC}"
    find "$LOGS_DIR" -name "app.log.*" -type f -mtime +7 -delete
    echo -e "${GREEN}Old log files cleaned${NC}"
    ;;

  *)
    echo "Usage: ./logs.sh [command]"
    echo ""
    echo "Commands:"
    echo "  tail, follow     - Follow live application logs from file"
    echo "  node             - Follow Node.js container logs"
    echo "  nginx            - Follow Nginx container logs"
    echo "  all              - Follow all container logs"
    echo "  search <term>    - Search logs for term (last 50 lines)"
    echo "  errors           - Show recent errors and warnings"
    echo "  json             - Pretty-print logs with jq (last 20 entries)"
    echo "  stats            - Show log statistics"
    echo "  clean            - Clean log files older than 7 days"
    echo ""
    echo "Examples:"
    echo "  ./logs.sh tail"
    echo "  ./logs.sh search 'rate_limit' 200"
    echo "  ./logs.sh errors"
    exit 1
    ;;
esac
