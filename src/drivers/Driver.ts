import { EntityData } from "../global/types";

export interface Driver {
  parseEntity(filePath: string): EntityData;
}