import { IEntityData } from "../drivers/types";
import { GlobalConfig } from "../global/Config";
import { DiagramLanguages, IConfigFile } from "../global/types";
import { FileSystemUtils } from "../utils/Filesystem";
import { MermaidBuilder } from "./mermaid/Mermaid";
import { IBuilder } from "./types";

export class Builder implements IBuilder {
  private diagramLanguage: DiagramLanguages;

  private builder: IBuilder;
  
  private diagram: string;

  constructor() {
    const { diagramLanguage } = FileSystemUtils.readAndParseJSONFile<IConfigFile>(GlobalConfig.CONFIG_PATH);

    this.diagramLanguage = diagramLanguage;
    this.builder = this.getBuilder();
    this.diagram = this.builder.getDiagram(); // Setup default diagram structure
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