import path from 'path';
import fs from "fs";
import { DefaultConfig } from '../types/init';

const configFile = "quilon.json";
const configPath = path.join(process.cwd(), configFile);

const defaultConfig: DefaultConfig = {
  entities: [],
};

export const init = (): void => {
  if (fs.existsSync(configPath)) {
    console.error(`${configFile} already exists.`);
    return;
  }

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`${configFile} successfully created.`);
}
