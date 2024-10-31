import { glob } from "glob";
import { readConfigFile } from "../utils/filesystem";
import path from 'path';
import fs from 'fs';
import { ORMs } from "../global/types";

export const generate = async (): Promise<void> => {
  const configFile = readConfigFile();
  const { entities, orm } = configFile;

  if (!entities || entities.length === 0) {
    throw new Error("No entities found")
  }

  entities.forEach(async (directory) => {
    const dirPath = path.resolve(directory);
    const fileName = getEntityFileName(orm);
    const files = await glob(`${dirPath}/**/${fileName}`);

    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      console.log(content);
    });
  });
}

const getEntityFileName = (orm: ORMs): string => {
  switch(orm) {
    case ORMs.TypeORM: 
      return "*.entity.ts";
    default:
      throw new Error(`ORM "${orm}" is not implemented.`);
  }
}