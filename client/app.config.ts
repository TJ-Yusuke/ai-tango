import { ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext) => {
  config.extra = {
    ...config.extra,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
  };
  return config;
};
