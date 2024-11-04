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
}

export interface IEntityData {
  name: string;
  columns: IColumnData[];
  relations: IRelationData[];
}

export interface IColumnData {
  name: string;
  type: string;
  // TODO: Remove
  decorators?: string[];
}

export interface IRelationData {
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