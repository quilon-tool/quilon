import { glob } from "glob";
import path from "path";
import { IConfigFile, ORMs } from "../../global/types";
import { readConfigFile } from "../../utils/filesystem";
import { AbstractCommand } from "../AbstractCommand";
import { TypeORMDriver } from "../../drivers/typeorm/TypeORMDriver";

export class GenerateCommand extends AbstractCommand {  
  execute() {
    const configFile = readConfigFile();
    const { entities, orm }: IConfigFile = configFile;

    if (!entities || entities.length === 0) {
      throw new Error("No entities found")
    }

    entities.forEach(async (directory) => {
      const dirPath = path.resolve(directory);
      const fileName = this.getEntityFileName(orm);
      const files = await glob(`${dirPath}/**/${fileName}`);

      const driver = new TypeORMDriver();

      files.forEach((file) => {
        // TODO: Parse column types into sql-like types
        // TODO: Convert the analyzed data into mermaid format
        // TODO: Generate a JPG using mermaid that displays the ERD
        // const entityData = this.analyzeEntity(orm, file);
        driver.setFilePath(file)
        console.log(driver.parseEntity());
      });
    });
  }

  private getEntityFileName(orm: ORMs): string {
    switch(orm) {
      case ORMs.TypeORM: 
        return "*.entity.ts";
      default:
        throw new Error(`ORM "${orm}" is not implemented.`);
    }
  }  

  // private analyzeEntity(orm: ORMs, filePath: string): EntityData | void {
  //   switch(orm) {
  //     case ORMs.TypeORM:
  //       return this.analyzeTypeORMEntity(filePath);
  //     default:
  //       throw new Error(`ORM "${orm}" is not implemented.`);
  //   }
  // }
}