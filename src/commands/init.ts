import fs from "fs";
import { DefaultConfig } from '../types/init';
import config from "../config/config";

// TODO: Create JSON Schema that gets automatically injected as "$schema" in quilon.json (Useful for autocompletion and validation)

const defaultConfig: DefaultConfig = {
  entities: [],
  orm: "TypeORM",
  diagramLanguage: "Mermaid"
};

export const init = (): void => {
  if (fs.existsSync(config.configPath)) {
    console.error(`${config.configFile} already exists.`);
    return;
  }

  fs.writeFileSync(config.configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`${config.configFile} successfully created.`);
}
