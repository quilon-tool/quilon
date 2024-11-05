export interface IDriver {
  parseEntity(filePath: string): IEntityData;
}

export interface IEntityData {
  name: string;
  columns: IColumnData[];
  relations: IRelationData[];
}

export interface IColumnData {
  name: string;
  type: string;
}

export interface IRelationData {
  name: string;
  type: string;
  relation: Relations;
}

// TODO: Rename to TRelations
export enum Relations {
  OneToOne = "OneToOne",
  OneToMany = "OneToMany",
  ManyToOne = "ManyToOne",
  ManyToMany = "ManyToMany",
};