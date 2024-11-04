import fs from "fs";
import config from "../global/config";
import { IConfigFile } from "../global/types";

export const readConfigFile = (): IConfigFile => {
  const configFileBuffer = fs.readFileSync(config.configPath);
  const configFile: IConfigFile = JSON.parse(configFileBuffer.toString());

  return configFile;
}