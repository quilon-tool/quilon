import fs from "fs";
import path from "path";

import { IConfigFile } from "../../global/types";
import { FileSystemUtils } from "../../utils/filesystem";
import { AbstractCommand } from "../AbstractCommand";
import { Driver } from "../../drivers/Driver";
import { GlobalConfig } from "../../global/config";
import { Builder } from "../../builders/Builder";

export class GenerateCommand extends AbstractCommand {
  async execute() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(GlobalConfig.CONFIG_PATH);
    const { entities, outputDir } = configFile;

    if (!entities || entities.length === 0) {
      throw new Error("No entities found");
    }

    const driver = new Driver();
    const builder = new Builder();

    for (const directory of entities) {
      const fileNamePattern = driver.getFileNamePattern();
      const files = await FileSystemUtils.readFilesFromDirectory(directory, fileNamePattern);

      for (const file of files) {
        driver.setFilePath(file);

        const parsedEntity = driver.parseEntity();
        builder.appendEntity(parsedEntity);
      }
    }

    const fileName = path.join(outputDir, `${GlobalConfig.DIAGRAM_FILE_NAME}.${builder.fileExtension}`);
    const diagram = builder.getDiagram();

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(fileName, diagram);

    console.log(`ERD successfully created!`);
  }
}
