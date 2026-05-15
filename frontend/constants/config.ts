const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  "https://moj-prevoz-appservice.azurewebsites.net/api";

const webSocketUrl =
  process.env.EXPO_PUBLIC_WS_URL?.trim() ||
  "wss://moj-prevoz-appservice.azurewebsites.net";

const encryptedApiKey = process.env.EXPO_PUBLIC_ENCRYPTED_API_KEY?.trim() || "";
const imgbbApiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY?.trim() || "";

export const appConfig = {
  apiBaseUrl,
  webSocketUrl,
  encryptedApiKey,
  imgbbApiKey,
};

export const getImgbbUploadUrl = () => {
  if (!imgbbApiKey) {
    throw new Error("Missing EXPO_PUBLIC_IMGBB_API_KEY");
  }

  return `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;
};
