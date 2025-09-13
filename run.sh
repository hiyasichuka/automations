#!/bin/bash
set -e
TEST_FILE="tests/human.spec.js"
npx playwright test "$TEST_FILE" --headed