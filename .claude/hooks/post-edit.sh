#!/bin/bash

# Post-edit hook for Claude Code
# This script runs after Edit, MultiEdit, and Write commands to automatically format and lint files

# Read the tool input/result from stdin (Claude Code passes tool details)
TOOL_INPUT=$(cat)

# Change to project directory
cd "$CLAUDE_PROJECT_DIR" || exit 0

# Extract file_path from the JSON input
FILE_PATH=$(echo "$TOOL_INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4 | head -1)

# If no file_path found, try to extract from "edits" array (for MultiEdit)
if [ -z "$FILE_PATH" ]; then
    FILE_PATH=$(echo "$TOOL_INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4 | head -1)
fi

# Check if we have a file path and if it's a relevant file type
if [ -n "$FILE_PATH" ] && [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx|css|scss|json|md)$ ]]; then
    echo "🎨 Auto-formatting: $FILE_PATH"
    
    # Check if file exists (might be relative to project root)
    if [ ! -f "$FILE_PATH" ] && [ -f "$CLAUDE_PROJECT_DIR/$FILE_PATH" ]; then
        FILE_PATH="$CLAUDE_PROJECT_DIR/$FILE_PATH"
    fi
    
    if [ -f "$FILE_PATH" ] && command -v bun &> /dev/null; then
        # Format and lint the file
        echo "📝 Running Biome on: $FILE_PATH"
        bunx biome check --write "$FILE_PATH" 2>/dev/null || true

        echo "✅ Auto-formatting completed for: $FILE_PATH"
    fi
fi

# Always exit successfully to not block the workflow
exit 0
