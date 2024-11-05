import { IEntityData } from "../drivers/types";

export interface IBuilder {
  getDiagram(): string;
  appendEntity(entity: IEntityData): void
}
