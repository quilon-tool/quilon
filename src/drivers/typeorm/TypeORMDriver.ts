import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
import { ColumnData, EntityData, RelationData, Relations } from "../../global/types";
import { Driver } from "../Driver";

export class TypeORMDriver implements Driver {
  private filePath: string | undefined;
  private entityClass: ClassDeclaration | undefined;

  parseEntity(): EntityData {
    if (!this.filePath || this.entityClass) {
      throw new Error("filePath or entityClass are undefined");
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

  setFilePath(filePath: string) {
    this.filePath = filePath;
  }

  private extractTableName(): string {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    return this.entityClass?.getName() || "% ENTITY %";
  }

  private extractColumns(): ColumnData[] {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const columns: ColumnData[] = [];

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

  private extractRelations(): RelationData[] {
    if (!this.entityClass) {
      throw new Error("entityClass is undefined");
    }

    const relations: RelationData[] = [];

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