#!/bin/bash
# Script to unpack the full 1,000,000 domain Tranco dataset if desired for offline testing.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/top-1m.csv.gz" ]; then
  echo "Unpacking full 1-million domain Tranco dataset..."
  gunzip -c "$SCRIPT_DIR/top-1m.csv.gz" > "$SCRIPT_DIR/top-1m.csv"
  echo "Done. Total domains: $(wc -l < "$SCRIPT_DIR/top-1m.csv")"
fi
