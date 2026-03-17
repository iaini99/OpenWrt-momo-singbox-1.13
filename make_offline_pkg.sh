#!/bin/bash

# MOMO Offline Package Generator
# This script bundles the current source code into a tarball that can be 
# extracted directly onto an OpenWrt router.

VERSION=$(grep "PKG_VERSION:=" momo/Makefile | cut -d'=' -f2)
OUTPUT="momo-offline-${VERSION}.tar.gz"

echo "Packaging MOMO ${VERSION} for offline installation..."

# Create temporary directory structure
TMP_DIR="momo_tmp"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/etc/momo"
mkdir -p "$TMP_DIR/etc/config"
mkdir -p "$TMP_DIR/etc/init.d"
mkdir -p "$TMP_DIR/etc/uci-defaults"
mkdir -p "$TMP_DIR/usr/lib/lua/luci"
mkdir -p "$TMP_DIR/www/luci-static/resources"

# Copy MOMO files
cp -r momo/files/ucode "$TMP_DIR/etc/momo/"
cp -r momo/files/scripts "$TMP_DIR/etc/momo/"
cp -r momo/files/firewall "$TMP_DIR/etc/momo/"
cp -r momo/files/profiles "$TMP_DIR/etc/momo/"
cp momo/files/momo.conf "$TMP_DIR/etc/config/momo"
cp momo/files/momo.init "$TMP_DIR/etc/init.d/momo"
chmod +x "$TMP_DIR/etc/init.d/momo"

# Copy LuCI files
cp -r luci-app-momo/root/* "$TMP_DIR/"
cp -r luci-app-momo/htdocs/* "$TMP_DIR/www/"

# Create the archive
tar -czf "$OUTPUT" -C "$TMP_DIR" .

rm -rf "$TMP_DIR"

echo "Success! Offline installation package generated: $OUTPUT"
echo "To install on router: scp $OUTPUT root@192.168.1.1:/tmp/ && ssh root@192.168.1.1 'tar -xzf /tmp/$OUTPUT -C /'"
