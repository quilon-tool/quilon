import { glob } from "glob";
import path from "path";
import { IConfigFile, ORMs } from "../../global/types";
import { FileSystemUtils } from "../../utils/Filesystem";
import { AbstractCommand } from "../AbstractCommand";
import { Driver } from "../../drivers/Driver";
import config from "../../global/config";

export class GenerateCommand extends AbstractCommand {  
  execute() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(config.configPath);
    const { entities, orm } = configFile;

    if (!entities || entities.length === 0) {
      throw new Error("No entities found")
    }

    const driver = new Driver();

    entities.forEach(async (directory) => {
      const fileNamePattern = driver.getFileNamePattern();
      const files = await FileSystemUtils.readFilesFromDirectory(directory, fileNamePattern);

      files.forEach((file) => {
        // TODO: Parse column types into sql-like types
        // TODO: Convert the analyzed data into mermaid format
        // TODO: Generate a JPG using mermaid that displays the ERD
        driver.setFilePath(file);
        console.log(driver.parseEntity());
      });
    });
  }
}