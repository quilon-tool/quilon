import { IEntityData } from "../drivers/types";
import { GlobalConfig } from "../global/Config";
import { DiagramLanguages, IConfigFile } from "../global/types";
import { FileSystemUtils } from "../utils/Filesystem";
import { MermaidBuilder } from "./mermaid/Mermaid";
import { IBuilder } from "./types";

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

  getDiagram(): string {
    return this.builder.getDiagram();
  }

  appendEntity(entity: IEntityData): void {
    this.builder.appendEntity(entity);
  }

  private getBuilder(): IBuilder {
    switch(this.diagramLanguage) {
      case DiagramLanguages.Mermaid:
        return new MermaidBuilder();
      default:
        throw new Error(`No Builder for Diagram Language ${this.diagramLanguage} implemented.`);
    }
  }
}