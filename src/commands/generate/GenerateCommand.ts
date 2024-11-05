import { IConfigFile } from "../../global/types";
import { FileSystemUtils } from "../../utils/Filesystem";
import { AbstractCommand } from "../AbstractCommand";
import { Driver } from "../../drivers/Driver";
import { GlobalConfig } from "../../global/Config";
import { Builder } from "../../builders/Builder";
import fs from 'fs';
import path from 'path';

// TODO: Generate a JPG using mermaid that displays the ERD
// TODO: Export the JPG and the Diagram Code to the directory, specified in quilon.json

// TODO: Add PK and FK section
// TODO: Add id of the related table (FK) to entity

export class GenerateCommand extends AbstractCommand {  
  private driver = new Driver();
  private builder = new Builder();

  async execute() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(GlobalConfig.CONFIG_FILE);
    const { entities } = configFile;

    if (!entities || entities.length === 0) {
      throw new Error("No entities found")
    }

    for (const directory of entities) {
      const fileNamePattern = this.driver.getFileNamePattern();
      const files = await FileSystemUtils.readFilesFromDirectory(directory, fileNamePattern);

      for (const file of files) {
        this.driver.setFilePath(file);

        const parsedEntity = this.driver.parseEntity();
        this.builder.appendEntity(parsedEntity);
      }
    }

    this.writeDiagramToFile();
  }

  private writeDiagramToFile(): void {
    const fileName = path.join(GlobalConfig.OUTPUT_DIR, `${GlobalConfig.DIAGRAM_FILE_NAME}.${this.builder.fileExtension}`);

    const diagram = this.builder.getDiagram();

    if (!fs.existsSync(GlobalConfig.OUTPUT_DIR)) {
      fs.mkdirSync(GlobalConfig.OUTPUT_DIR);
    }

    fs.writeFileSync(fileName, diagram);
  }
}