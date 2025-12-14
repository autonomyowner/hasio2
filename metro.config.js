const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Fix event-target-shim version conflict for WebRTC
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "event-target-shim" &&
    context.originModulePath.includes("react-native-webrtc")
  ) {
    return context.resolveRequest(context, "event-target-shim", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
