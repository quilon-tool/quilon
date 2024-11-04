import { IEntityData } from "../global/types";

export interface IDriver {
  parseEntity(filePath: string): IEntityData;
}