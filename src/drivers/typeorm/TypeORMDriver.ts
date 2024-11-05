import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
import { IDriver, IColumnData, IEntityData, IRelationData, TRelations } from "../types";

export class TypeORMDriver implements IDriver {
  private entityClass: ClassDeclaration | undefined;

  private mappedDataTypes: { [key: string ]: string } = {
    string: "varchar",
    number: "integer",
    boolean: "boolean",
    Date: "timestamp",
    float: "float",
    double: "double precision",
    decimal: "numeric",
    int: "integer",
    integer: "integer",
    smallint: "smallint",
    bigint: "bigint",
    text: "text",
    json: "json",
    jsonb: "jsonb",
    uuid: "uuid",
    char: "char",
    varchar: "varchar",
    bytea: "bytea",
    real: "real",
    date: "date",
    time: "time",
    timestamp: "timestamp",
    timestamptz: "timestamptz",
    interval: "interval",
    array: "ARRAY", 
    geometry: "geometry",
    geography: "geography", 
    enum: "enum"
  }

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
        // Type can be specified with @Column({ type: "float" })
        const decoratorType = this.getDecoratorType(property);

        const columnName = property.getName();
        const columnType = decoratorType || property.getType().getText();

        // Typescript Type has to be converted into corresponding SQL type
        const mappedType = this.mappedDataTypes[columnType] || "text"

        columns.push({
          name: columnName,
          type: mappedType,
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
          type: columnType.replace(/\[\]/, ''),
          relation: relationDecorator as TRelations,
        });
      }
    });

    return relations;
  }

  private getDecoratorType(property: PropertyDeclaration): string | undefined {
    let decoratorType;

    property.getDecorators().map((decorator) => {
      const args = decorator.getArguments();
      const type = args.find((arg) => arg.getText().includes("type"));
      
      if (!type) {
        return;
      }

      decoratorType = this.getDecoratorTypeValue(type.getText()); 
    });

    return decoratorType;
  }

  private getDecoratorTypeValue(type: string): string | undefined {
    // For example: type --> '{ type: "float" }'
    const regex = /type:\s*"(.*?)"/;
    const match = type.match(regex);

    let typeValue;

    if (match) {
      typeValue = match[1];
    }

    return typeValue;
  }

  private getRelationDecorator(property: PropertyDeclaration): string | undefined {
    const decorators = property.getDecorators().map((decorator) => decorator.getName());

    return decorators.find((decorator) => {
      if (Object.keys(TRelations).includes(decorator)) {
        return decorator;
      }
    });
  }
}