#!/usr/bin/env bash
#
# First-time Let's Encrypt TLS setup for the Sanos nginx container.
#
# Run ONCE on the EC2 host, from the repo root, AFTER the domain's DNS resolves
# to this instance (check: `nslookup sanosmedical.com` -> 52.22.30.154) and the
# security group allows inbound 80 + 443:
#
#     CERTBOT_EMAIL="you@example.com" ./deploy/init-tls.sh
#
# Optional: STAGING=1 to dry-run against Let's Encrypt staging (avoids the rate
# limit while testing), then re-run with STAGING=0 for the real cert.
#
# It boots nginx with a throwaway self-signed cert (so the :443 block can start),
# confirms nginx is actually serving :80, then swaps in a real cert via the
# HTTP-01 webroot challenge. Renewal afterwards is the cron entry in the README.
set -euo pipefail

DOMAIN="sanosmedical.com"
ALT="www.sanosmedical.com"
EMAIL="${CERTBOT_EMAIL:-info@sanosmedical.com}"   # override: CERTBOT_EMAIL=... ./deploy/init-tls.sh
STAGING="${STAGING:-0}"                            # 1 = Let's Encrypt staging (testing only)

CONF="./deploy/certbot/conf"
WEBROOT="./deploy/certbot/www"

cd "$(dirname "$0")/.."
mkdir -p "$CONF/live/$DOMAIN" "$WEBROOT/.well-known/acme-challenge"

# 1. (Re)create a throwaway self-signed cert so nginx's :443 block can boot.
#    Unconditional so a half-finished previous run can't leave nginx certless.
echo "### Creating bootstrap self-signed cert so nginx can boot..."
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "$CONF/live/$DOMAIN/privkey.pem" \
  -out    "$CONF/live/$DOMAIN/fullchain.pem" \
  -subj "/CN=$DOMAIN"

# 2. Build + start the stack (app + nginx). nginx now listens on :80 and :443.
echo "### Building and starting the stack..."
docker compose up -d --build

# 3. GATE: wait until nginx actually serves HTTP on :80. Certbot's challenge is
#    pointless if nginx is crash-looping, so fail fast with logs if it is.
echo "### Waiting for nginx to serve port 80..."
ok=0
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://localhost/"; then ok=1; break; fi
  sleep 2
done
if [ "$ok" -ne 1 ]; then
  echo "!!! nginx is NOT serving port 80 — aborting before certbot. Recent logs:"
  docker compose logs nginx --tail=25
  exit 1
fi
echo "### nginx is up."

# 4. Swap the bootstrap cert for a real one via the webroot challenge. nginx
#    stays up throughout (it holds the deleted cert's open file handle), so the
#    challenge on :80 keeps being served.
echo "### Requesting Let's Encrypt certificate for $DOMAIN, $ALT ..."
rm -rf "$CONF/live/$DOMAIN" "$CONF/archive/$DOMAIN" "$CONF/renewal/$DOMAIN.conf"
staging_arg=""
[ "$STAGING" != "0" ] && staging_arg="--staging"
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  $staging_arg \
  -d "$DOMAIN" -d "$ALT" \
  --email "$EMAIL" --agree-tos --no-eff-email --non-interactive

# 5. Reload nginx so it picks up the real certificate.
echo "### Reloading nginx with the real certificate..."
docker compose exec nginx nginx -s reload

echo "### Done — https://$DOMAIN should now be live."
