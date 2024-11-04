import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
import { IDriver, IColumnData, IEntityData, IRelationData, Relations } from "../types";

export class TypeORMDriver implements IDriver {
  private entityClass: ClassDeclaration | undefined;

  constructor(private filePath: string) {}

  parseEntity(): IEntityData {
    if (this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const project = new Project();
    const sourceFile: SourceFile = project.addSourceFileAtPath(this.filePath);

    this.entityClass = sourceFile.getClass((cls) => {
      return cls.getDecorator('Entity') !== undefined;
    });

    return {
      name: this.extractTableName(),
      columns: this.extractColumns(),
      relations: this.extractRelations(),
    }
  }

  private extractTableName(): string {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    return this.entityClass?.getName() || "% ENTITY %";
  }

  private extractColumns(): IColumnData[] {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const columns: IColumnData[] = [];

    this.entityClass.getProperties().forEach((property) => {
      const relationDecorator = this.getRelationDecorator(property);

      if (!relationDecorator) {
        const columnName = property.getName();
        const columnType = property.getType().getText();

        columns.push({
          name: columnName,
          type: columnType,
        });
      }
    });

    return columns;
  }

  private extractRelations(): IRelationData[] {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const relations: IRelationData[] = [];

    this.entityClass.getProperties().forEach((property) => {
      const relationDecorator = this.getRelationDecorator(property);

      if (relationDecorator) {
        const columnName = property.getName();
        const columnType = property.getType().getText();

        relations.push({
          name: columnName,
          type: columnType,
          relation: relationDecorator as Relations,
        });
      }
    });

    return relations;
  }

  private getRelationDecorator(property: PropertyDeclaration): string | undefined {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const decorators = property.getDecorators().map((decorator) => decorator.getName());

    return decorators.find((decorator) => {
      if (Object.keys(Relations).includes(decorator)) {
        return decorator;
      }
    });
  }
}