export enum ORMs {
  TypeORM = "TypeORM"
}

export enum DiagramLanguages {
  Mermaid = "Mermaid"
}

export interface IConfigFile {
  entities: string[];
  orm: ORMs;
  diagramLanguage: DiagramLanguages;
  outputDir: string;
}
