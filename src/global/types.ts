export enum ORMs {
  TypeORM = "TypeORM"
}

export enum DiagramLanguages {
  Mermaid = "Mermaid"
}

export interface ConfigFile {
  entities: string[];
  orm: ORMs;
  diagramLanguage: DiagramLanguages;
}