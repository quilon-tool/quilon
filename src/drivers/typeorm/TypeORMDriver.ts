import { ClassDeclaration, Project, SourceFile } from "ts-morph";
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
    return [
      { name: 'id', type: 'number', decorators: [] },
      { name: 'name', type: 'string', decorators: [] },
      { name: 'age', type: 'number', decorators: [] }
    ];
  }

  private extractRelations(): RelationData[] {
    return [
      { name: 'posts', type: 'Post[]', relation: Relations.OneToMany }
    ];
  }
}