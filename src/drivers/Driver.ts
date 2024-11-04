import config from "../global/config";
import { IConfigFile, IEntityData, ORMs } from "../global/types";
import { FileSystemUtils } from "../utils/Filesystem";
import { TypeORMDriver } from "./typeorm/TypeORMDriver";
import { IDriver } from "./types";

export class Driver implements IDriver {
  orm: ORMs;
  filePath: string;
  
  constructor(filePath: string) {
    const { orm } = FileSystemUtils.readAndParseJSONFile<IConfigFile>(config.configPath);
    
    this.orm = orm;
    this.filePath = filePath;
  }

  parseEntity(): IEntityData {
    const driver = this.getDriver();
    return driver.parseEntity(this.filePath);
  }

  private getDriver(): IDriver {
    switch(this.orm) {
      case ORMs.TypeORM:
        return new TypeORMDriver(this.filePath);
      default:
        throw new Error(`No Driver for ORM${this.orm} implemented.`);
    }
  }
}