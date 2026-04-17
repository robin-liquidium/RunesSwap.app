#!/usr/bin/env sh

set -eu

# Node 25+ can emit warnings when code touches global localStorage without a
# configured persistence file. Configure one only on runtimes that support it.
if node --help 2>/dev/null | grep -q -- '--localstorage-file'; then
  STORAGE_FILE="${NODE_LOCALSTORAGE_FILE:-$PWD/.next/node-localstorage.json}"
  STORAGE_DIR="$(dirname "$STORAGE_FILE")"
  mkdir -p "$STORAGE_DIR"

  case " ${NODE_OPTIONS:-} " in
    *" --localstorage-file="*) ;;
    *)
      if [ -n "${NODE_OPTIONS:-}" ]; then
        export NODE_OPTIONS="$NODE_OPTIONS --localstorage-file=$STORAGE_FILE"
      else
        export NODE_OPTIONS="--localstorage-file=$STORAGE_FILE"
      fi
      ;;
  esac
fi

exec next build
