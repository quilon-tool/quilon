import fs from "fs";
import { IConfigFile, DiagramLanguages, ORMs } from "../../global/types";
import { GlobalConfig } from "../../global/Config";
import { AbstractCommand } from "../AbstractCommand";

export class InitCommand extends AbstractCommand {
  private DEFAULT_CONFIG: IConfigFile = {
    $schema: "https://raw.githubusercontent.com/quilon-tool/quilon/refs/heads/main/src/config/config-schema.json",
    entities: [],
    orm: ORMs.TypeORM,
    diagramLanguage: DiagramLanguages.Mermaid,
    outputDir: GlobalConfig.OUTPUT_DIR
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