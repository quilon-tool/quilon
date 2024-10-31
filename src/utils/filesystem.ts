import fs from "fs";
import config from "../global/config";
import { ConfigFile } from "../global/types";

export const readConfigFile = (): ConfigFile => {
  const configFileBuffer = fs.readFileSync(config.configPath);
  const configFile: ConfigFile = JSON.parse(configFileBuffer.toString());

  return configFile;
}