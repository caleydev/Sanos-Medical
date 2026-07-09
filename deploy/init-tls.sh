#!/usr/bin/env bash
#
# First-time Let's Encrypt TLS setup for the Sanos nginx container.
#
# Run ONCE on the EC2 host, from the repo root, AFTER the domain's DNS resolves
# to this instance (check: `nslookup sanosmedical.com` -> 52.22.30.154) and the
# security group allows inbound 80 + 443:
#
#     ./deploy/init-tls.sh
#
# It boots nginx with a throwaway self-signed cert (so the :443 block can start),
# then swaps in a real Let's Encrypt cert via the HTTP-01 webroot challenge.
# Renewal afterwards is handled by the cron entry documented in the README.
set -euo pipefail

DOMAIN="sanosmedical.com"
ALT="www.sanosmedical.com"
EMAIL="admin@sanosmedical.com"   # <-- real contact; Let's Encrypt sends expiry notices here
STAGING=0                         # set to 1 to dry-run against LE staging (avoids rate limits)

CONF="./deploy/certbot/conf"
WEBROOT="./deploy/certbot/www"

cd "$(dirname "$0")/.."
mkdir -p "$CONF/live/$DOMAIN" "$WEBROOT"

# 1. Bootstrap self-signed cert so nginx's :443 server block can start.
if [ ! -s "$CONF/live/$DOMAIN/fullchain.pem" ]; then
  echo "### Creating throwaway self-signed cert so nginx can boot..."
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$CONF/live/$DOMAIN/privkey.pem" \
    -out    "$CONF/live/$DOMAIN/fullchain.pem" \
    -subj "/CN=$DOMAIN"
fi

# 2. Build + start the stack (app + nginx). nginx now listens on :80 and :443.
echo "### Building and starting the stack..."
docker compose up -d --build

# 3. Drop the bootstrap cert and request a real one via the webroot challenge.
echo "### Requesting Let's Encrypt certificate for $DOMAIN, $ALT ..."
rm -rf "$CONF/live/$DOMAIN" "$CONF/archive/$DOMAIN" "$CONF/renewal/$DOMAIN.conf"

staging_arg=""
[ "$STAGING" != "0" ] && staging_arg="--staging"

docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  $staging_arg \
  -d "$DOMAIN" -d "$ALT" \
  --email "$EMAIL" --agree-tos --no-eff-email --non-interactive

# 4. Reload nginx so it picks up the real certificate.
echo "### Reloading nginx with the real certificate..."
docker compose exec nginx nginx -s reload

echo "### Done — https://$DOMAIN should now be live."
