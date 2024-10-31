import fs from "fs";
import { ConfigFile } from "../global/types";
import config from "../global/config";

// TODO: Create JSON Schema that gets automatically injected as "$schema" in quilon.json (Useful for autocompletion and validation)

const defaultConfig: ConfigFile = {
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
