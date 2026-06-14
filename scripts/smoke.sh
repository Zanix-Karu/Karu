#!/usr/bin/env bash
# Post-deploy smoke test — verifies security-critical endpoints behave correctly.
# Run: bash scripts/smoke.sh [base_url]
# Default base URL: https://www.getkaru.io

set -euo pipefail

BASE="${1:-https://www.getkaru.io}"
PASS=0
FAIL=0

check() {
  local desc="$1" url="$2" expected_code="$3"
  local actual_code
  actual_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$actual_code" = "$expected_code" ]; then
    echo "  ✓ $desc ($actual_code)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $desc — expected $expected_code, got $actual_code"
    FAIL=$((FAIL + 1))
  fi
}

check_post() {
  local desc="$1" url="$2" expected_code="$3" data="$4"
  local actual_code
  actual_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H 'Content-Type: application/json' \
    -d "$data" "$url")
  if [ "$actual_code" = "$expected_code" ]; then
    echo "  ✓ $desc ($actual_code)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $desc — expected $expected_code, got $actual_code"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "Karu production smoke test"
echo "Base: $BASE"
echo "─────────────────────────────────────"
echo ""
echo "Admin API (must reject without cookie):"
check "GET  /api/admin/data"   "$BASE/api/admin/data"   "401"
check "GET  /api/admin/emails" "$BASE/api/admin/emails" "401"
check_post "POST /api/admin/send" "$BASE/api/admin/send" "401" '{"subject":"x","html":"y"}'

echo ""
echo "Public endpoints (must be reachable):"
check "GET  /api/waitlist/count" "$BASE/api/waitlist/count" "200"
check "GET  /en (landing page)"  "$BASE/en"                 "200"

echo ""
echo "Privacy endpoints (POST without CSRF must be rejected):"
check_post "POST /api/privacy/request (no XHR header)" "$BASE/api/privacy/request" "403" '{"email":"test@x.com","request_type":"export"}'
check_post "POST /api/privacy/confirm (no XHR/cookie)"  "$BASE/api/privacy/confirm" "403" '{}'

echo ""
echo "─────────────────────────────────────"
echo "Results: $PASS passed, $FAIL failed"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "⚠ SMOKE TEST FAILED — do NOT consider this deploy safe."
  exit 1
fi
echo "✓ All smoke checks passed."
