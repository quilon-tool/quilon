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

export interface EntityData {
  name: string;
  columns: ColumnData[];
  relations: RelationData[];
}

export interface ColumnData {
  name: string;
  type: string;
  // TODO: Remove
  decorators?: string[];
}

export interface RelationData {
  name: string;
  type: string;
  relation: Relations;
}

export enum Relations {
  OneToOne = "OneToOne",
  OneToMany = "OneToMany",
  ManyToOne = "ManyToOne",
  ManyToMany = "ManyToMany",
};