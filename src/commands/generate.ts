import { glob } from "glob";
import { readConfigFile } from "../utils/filesystem";
import path from 'path';
import fs from 'fs';
import { EntityData, ORMs, Relations } from "../global/types";
import { ClassDeclaration, Project, SourceFile } from "ts-morph";

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
      // TODO: Parse column types into sql-like types
      // TODO: Convert the analyzed data into mermaid format
      // TODO: Generate a JPG using mermaid that displays the ERD
      const entityData = analyzeEntity(orm, file);
      console.log(entityData);
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

const analyzeEntity = (orm: ORMs, filePath: string): EntityData | void => {
  switch(orm) {
    case ORMs.TypeORM:
      return analyzeTypeORMEntity(filePath);
    default:
      throw new Error(`ORM "${orm}" is not implemented.`);
  }
}

const analyzeTypeORMEntity = (filePath: string): EntityData | void => {
  const entityClass = extractTypeORMEntityClass(filePath);
  return extractTypeORMProperties(entityClass);
}

const extractTypeORMEntityClass = (filePath: string): ClassDeclaration => {
  const project = new Project();
  const sourceFile: SourceFile = project.addSourceFileAtPath(filePath);
  const entityClass = sourceFile.getClass((cls) => {
    // Find the class decorated with "@Entity"
    return cls.getDecorator('Entity') !== undefined;
  });

  if (!entityClass) {
    throw new Error(`No entity found for ${filePath}`);
  }

  return entityClass;
}

const extractTypeORMProperties = (entityClass: ClassDeclaration): EntityData => {
  const entityData: EntityData = {
    name: entityClass.getName()!,
    columns: [],
    relations: [],
  };

  entityClass.getProperties().forEach((property) =>  {
    const decorators = property.getDecorators().map((decorator) => decorator.getName());
    const propertyName = property.getName();
    const propertyType = property.getType().getText();

    const relationDecorator = decorators.find((decorator) => {
      if (Object.keys(Relations).includes(decorator)) {
        return decorator;
      }
    });

    if (relationDecorator) {
      entityData.relations.push({
        name: propertyName,
        type: propertyType,
        relation: relationDecorator as Relations,
      })
    } else {
      entityData.columns.push({
        name: propertyName,
        type: propertyType,
        decorators,
      });
    }
  });

  return entityData;
}