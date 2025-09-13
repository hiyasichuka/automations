#!/bin/bash
set -euo pipefail
npx playwright test tests/auth.setup.spec.js --headed
npx playwright test tests/human-night.spec.js --headed
