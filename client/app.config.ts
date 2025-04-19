import { ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext) => {
  config.extra = {
    ...config.extra,
    API_BASE_URL: process.env.API_BASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
  };
  return config;
};
