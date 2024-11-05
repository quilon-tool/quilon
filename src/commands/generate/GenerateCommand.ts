import { IConfigFile } from "../../global/types";
import { FileSystemUtils } from "../../utils/Filesystem";
import { AbstractCommand } from "../AbstractCommand";
import { Driver } from "../../drivers/Driver";
import { GlobalConfig } from "../../global/Config";
import { Builder } from "../../builders/Builder";

// TODO: Generate a JPG using mermaid that displays the ERD
// TODO: Export the JPG and the Diagram Code to the directory, specified in quilon.json

export class GenerateCommand extends AbstractCommand {  
  async execute() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(GlobalConfig.CONFIG_FILE);
    const { entities } = configFile;

    if (!entities || entities.length === 0) {
      throw new Error("No entities found")
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

    console.log(builder.getDiagram());
  }
}