import { IEntityData } from '../drivers/types';
import { GlobalConfig } from '../global/Config';
import { DiagramLanguages, IConfigFile } from '../global/types';
import { FileSystemUtils } from '../utils/filesystem';
import { MermaidBuilder } from './mermaid/Mermaid';
import { IBuilder } from './types';

export class Builder implements IBuilder {
  readonly fileExtension: string;

  private diagramLanguage: DiagramLanguages;

  private builder: IBuilder;

  constructor() {
    const configFile = FileSystemUtils.readAndParseJSONFile<IConfigFile>(GlobalConfig.CONFIG_PATH);
    const { diagramLanguage } = configFile;

    this.diagramLanguage = diagramLanguage;
    this.builder = this.getBuilder();
    this.fileExtension = this.builder.fileExtension;
  }

  /**
   * Generates and returns the diagram as a string.
   *
   * @returns {string} The generated diagram.
   */
  getDiagram(): string {
    return this.builder.getDiagram();
  }

  /**
   * Appends an entity to the current diagram.
   *
   * @param {IEntityData} entity - The entity data to be added to the diagram.
   */
  appendEntity(entity: IEntityData): void {
    this.builder.appendEntity(entity);
  }

  /**
   * Selects and returns the appropriate builder instance based on the configured diagram language.
   *
   * @private
   * @returns {IBuilder} The builder instance for the specified diagram language.
   * @throws {Error} If there is no builder implemented for the specified diagram language.
   */
  private getBuilder(): IBuilder {
    switch (this.diagramLanguage) {
      case DiagramLanguages.Mermaid:
        return new MermaidBuilder();
      default:
        throw new Error(`No Builder for Diagram Language ${this.diagramLanguage} implemented.`);
    }
  }
}
