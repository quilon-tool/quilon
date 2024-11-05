import { IEntityData } from "../drivers/types";

export interface IBuilder {
  readonly fileExtension: string;
  getDiagram(): string;
  appendEntity(entity: IEntityData): void
}
