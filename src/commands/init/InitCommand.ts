import fs from "fs";
import { IConfigFile, DiagramLanguages, ORMs } from "../../global/types";
import { GlobalConfig } from "../../global/Config";
import { AbstractCommand } from "../AbstractCommand";

// TODO: Create JSON Schema that gets automatically injected as "$schema" in quilon.json (Useful for autocompletion and validation)

export class InitCommand extends AbstractCommand {
  private DEFAULT_CONFIG: IConfigFile = {
    entities: [],
    orm: ORMs.TypeORM,
    diagramLanguage: DiagramLanguages.Mermaid
  }

 execute(): void {
  if (fs.existsSync(GlobalConfig.CONFIG_PATH)) {
    console.error(`${GlobalConfig.CONFIG_FILE} already exists.`);
    return;
  }

  fs.writeFileSync(GlobalConfig.CONFIG_PATH, JSON.stringify(this.DEFAULT_CONFIG, null, 2));
  console.log(`${GlobalConfig.CONFIG_FILE} successfully created.`);
 } 
}