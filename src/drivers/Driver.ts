import { GlobalConfig } from '../global/Config';
import { IConfigFile, ORMs } from '../global/types';
import { FileSystemUtils } from '../utils/Filesystem';
import { TypeORMDriver } from './typeorm/Typeorm';
import { IDriver, IEntityData } from './types';

export class Driver implements IDriver {
  private orm: ORMs;
  private filePath: string | undefined;

  constructor() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(
      GlobalConfig.CONFIG_PATH
    );
    const { orm } = configFile;

    this.orm = orm;
  }

  /**
   * Sets the file path for the entity to be parsed.
   *
   * @param {string} filePath - The path of the file to parse.
   */
  setFilePath(filePath: string): void {
    this.filePath = filePath;
  }

  /**
   * Parses an entity from the specified file path using the appropriate ORM driver.
   *
   * @returns {IEntityData} The parsed entity data.
   * @throws {Error} If the file path is not set or if no suitable driver is found.
   */
  parseEntity(): IEntityData {
    if (!this.filePath) {
      throw new Error('filePath is not defined.');
    }

    const driver = this.getDriver();
    return driver.parseEntity(this.filePath);
  }

  /**
   * Returns the filename pattern to match entity files for the configured ORM.
   *
   * @returns {string} The file name pattern.
   * @throws {Error} If no pattern is implemented for the configured ORM.
   */
  getFileNamePattern(): string {
    switch (this.orm) {
      case ORMs.TypeORM:
        return '*.entity.ts';
      default:
        throw new Error(`No Driver for ORM ${this.orm} implemented.`);
    }
  }

  /**
   * Returns the appropriate driver instance based on the configured ORM.
   *
   * @private
   * @returns {IDriver} The driver instance for the specified ORM.
   * @throws {Error} If the file path is not set or if no suitable driver is found.
   */
  private getDriver(): IDriver {
    if (!this.filePath) {
      throw new Error('filePath is not defined.');
    }

    switch (this.orm) {
      case ORMs.TypeORM:
        return new TypeORMDriver(this.filePath);
      default:
        throw new Error(`No Driver for ORM ${this.orm} implemented.`);
    }
  }
}
