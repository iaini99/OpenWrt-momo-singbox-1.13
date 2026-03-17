#!/bin/bash

# MOMO Local Package Generator for OpenWrt 25.12
# This script uses the OpenWrt SDK via Docker to build APK files.

ARCH=${1:-"x86_64"}
BRANCH="openwrt-25.12"
CONTAINER_NAME="momo-build-25.12"

echo "Building MOMO packages for OpenWrt 25.12 ($ARCH)..."

# 1. Create a workspace
mkdir -p build/package
cp -r momo build/package/
cp -r luci-app-momo build/package/

# 2. Run the build using Docker (OpenWrt SDK)
# Note: Using the official OpenWrt SDK container for the specific arch/branch
docker run --rm -v "$(pwd)/build:/sdk/package/momo-project" \
    openwrt/sdk:$ARCH-$BRANCH \
    /bin/bash -c "
        ./scripts/feeds update -a && \
        ./scripts/feeds install -a && \
        make package/momo-project/momo/compile V=s && \
        make package/momo-project/luci-app-momo/compile V=s
    "

# 3. Collect outputs
if [ d -d "build/bin" ]; then
    echo "Build success! Collecting files..."
    mkdir -p dist/25.12/$ARCH
    find build/bin -name "*.apk" -exec cp {} dist/25.12/$ARCH/ \;
    echo "Files generated in dist/25.12/$ARCH/"
else
    echo "Build failed. Please check Docker logs."
fi
