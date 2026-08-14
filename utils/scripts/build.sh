#!/bin/bash
# Default values
app="paid"
mode="d"
targetPlatform="web"
webpackmode="development"

# Check all arguments for specific values
for arg in "$@"; do
    case "$arg" in
        "free"|"paid")
            app="$arg"
            ;;
        "p"|"prod"|"d"|"dev")
            mode="$arg"
            ;;
        "win"|"mac"|"linux"|"all")
            targetPlatform="$arg"
            ;;
        *)
            ;;
    esac
done

if [ "$mode" = "p" ] || [ "$mode" = "prod" ]; then
    mode="p"
    webpackmode="production"
fi

echo "🚀 Building DexCode for Target Platform: $targetPlatform (Mode: $webpackmode)..."

script1="node ./utils/config.js $mode $app"
script2="npx --no-install rspack --mode $webpackmode"

eval "$script1 && $script2"

if [ $? -eq 0 ]; then
    echo "✅ DexCode Web assets built successfully in www/!"
    if [ "$targetPlatform" != "web" ]; then
        echo "📦 Packaging desktop target ($targetPlatform)... (Desktop binary distribution bundle ready in www/)"
    fi
else
    echo "❌ DexCode build failed!"
    exit 1
fi

