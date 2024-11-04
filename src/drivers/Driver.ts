import config from "../global/config";
import { IConfigFile, IEntityData, ORMs } from "../global/types";
import { FileSystemUtils } from "../utils/Filesystem";
import { TypeORMDriver } from "./typeorm/TypeORMDriver";
import { IDriver } from "./types";

export class Driver implements IDriver {
  private orm: ORMs;
  private filePath: string | undefined;
  
  constructor() {
    const { orm } = FileSystemUtils.readAndParseJSONFile<IConfigFile>(config.configPath);
    
    this.orm = orm;
  }

  setFilePath(filePath: string): void {
    this.filePath = filePath;
  }

  parseEntity(): IEntityData {
    if (!this.filePath) {
      throw new Error("filePath is not defined.");
    }

    const driver = this.getDriver();
    return driver.parseEntity(this.filePath);
  }

  getFileNamePattern(): string {
    switch(this.orm) {
      case ORMs.TypeORM:
        return "*.entity.ts";
      default:
        throw new Error(`No Driver for ORM${this.orm} implemented.`);
    }
  }

  private getDriver(): IDriver {
    if (!this.filePath) {
      throw new Error("filePath is not defined.");
    }

    switch(this.orm) {
      case ORMs.TypeORM:
        return new TypeORMDriver(this.filePath);
      default:
        throw new Error(`No Driver for ORM${this.orm} implemented.`);
    }
  }
}