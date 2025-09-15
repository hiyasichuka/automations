#!/bin/bash
set -euo pipefail
npx playwright test tests/human.spec.js --headed
