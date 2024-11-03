import fs from "fs";
import { ConfigFile, DiagramLanguages, ORMs } from "../../global/types";
import config from "../../global/config";
import { AbstractCommand } from "../AbstractCommand";

// TODO: Create JSON Schema that gets automatically injected as "$schema" in quilon.json (Useful for autocompletion and validation)

export class InitCommand extends AbstractCommand {
  private DEFAULT_CONFIG: ConfigFile = {
    entities: [],
    orm: ORMs.TypeORM,
    diagramLanguage: DiagramLanguages.Mermaid
  }

 execute(): void {
  if (fs.existsSync(config.configPath)) {
    console.error(`${config.configFile} already exists.`);
    return;
  }

  fs.writeFileSync(config.configPath, JSON.stringify(this.DEFAULT_CONFIG, null, 2));
  console.log(`${config.configFile} successfully created.`);
 } 
}