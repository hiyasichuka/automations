#!/bin/bash
set -euo pipefail

# .envファイルから環境変数を読み込み
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# 引数でURLが渡された場合は環境変数を上書き
if [ $# -gt 0 ]; then
    export TEST_URL="$1"
    echo "Using custom URL: $TEST_URL"
else
    echo "Using URL from .env: $TEST_URL"
fi

npx playwright test tests/it.spec.js --headed