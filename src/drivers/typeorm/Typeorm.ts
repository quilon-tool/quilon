import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from 'ts-morph';
import { IDriver, IColumnData, IEntityData, IRelationData, TRelations } from '../types';

export class TypeORMDriver implements IDriver {
  private entityClass: ClassDeclaration | undefined;

  private mappedDataTypes: { [key: string]: string } = {
    string: 'varchar',
    number: 'integer',
    boolean: 'boolean',
    Date: 'timestamp',
    float: 'float',
    double: 'double precision',
    decimal: 'numeric',
    int: 'integer',
    integer: 'integer',
    smallint: 'smallint',
    bigint: 'bigint',
    text: 'text',
    json: 'json',
    jsonb: 'jsonb',
    uuid: 'uuid',
    char: 'char',
    varchar: 'varchar',
    bytea: 'bytea',
    real: 'real',
    date: 'date',
    time: 'time',
    timestamp: 'timestamp',
    timestamptz: 'timestamptz',
    interval: 'interval',
    array: 'ARRAY',
    geometry: 'geometry',
    geography: 'geography',
    enum: 'enum',
  };

  constructor(private filePath: string) {}

  /**
   * Parses the entity from the provided file path.
   *
   * @returns {IEntityData} The parsed entity data including table name, columns, and relations.
   * @throws {Error} If the entity class is not defined.
   */
  parseEntity(): IEntityData {
    if (this.entityClass) {
      throw new Error('entityClass is undefined');
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
    };
  }

  /**
   * Extracts the table name for the entity.
   *
   * @private
   * @returns {string} The name of the table or a default placeholder if undefined.
   * @throws {Error} If the entity class is not defined.
   */
  private extractTableName(): string {
    if (!this.entityClass) {
      throw new Error('entityClass is undefined');
    }

    return this.entityClass?.getName() || '% ENTITY %';
  }

  /**
   * Extracts column data from the entity's properties.
   *
   * @private
   * @returns {IColumnData[]} An array of column data including names and types.
   * @throws {Error} If the entity class is not defined.
   */
  private extractColumns(): IColumnData[] {
    if (!this.entityClass) {
      throw new Error('entityClass is undefined');
    }

    const columns: IColumnData[] = [];

    let primaryKeyColumnType: string;

    this.entityClass.getProperties().forEach((property) => {
      const relationDecorator = this.getRelationDecorator(property);
      const primaryKeyColumnDecorator = this.getPrimaryKeyColumnDecorator(property);

      if (primaryKeyColumnDecorator) {
        primaryKeyColumnType = property.getType().getText();
      }

      if (!relationDecorator) {
        // Type can be specified with @Column({ type: "float" })
        const decoratorType = this.getDecoratorType(property);

        const columnName = `${property.getName()} ${primaryKeyColumnDecorator ? '(PK)' : ''}`;
        const columnType = decoratorType || property.getType().getText();

        // Typescript Type has to be converted into corresponding SQL type
        const mappedType = this.mappedDataTypes[columnType] || 'text';

        columns.push({
          name: columnName,
          type: mappedType,
        });
      }

      if (relationDecorator === TRelations.ManyToOne || relationDecorator === TRelations.ManyToMany) {
        const columnName = `${property.getName()}Id (FK)`;

        // Use the type of the primary key because foreign keys will have the same type
        const mappedType = this.mappedDataTypes[primaryKeyColumnType] || 'number';

        columns.push({
          name: columnName,
          type: mappedType,
        });
      }
    });

    return columns;
  }

  /**
   * Extracts relation data from the entity's properties.
   *
   * @private
   * @returns {IRelationData[]} An array of relation data including names, types, and relation types.
   * @throws {Error} If the entity class is not defined.
   */
  private extractRelations(): IRelationData[] {
    if (!this.entityClass) {
      throw new Error('entityClass is undefined');
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

  /**
   * Retrieves the column type specified in a decorator, if present.
   *
   * @private
   * @param {PropertyDeclaration} property - The property to inspect for column type.
   * @returns {string | undefined} The specified column type or undefined if not found.
   */
  private getDecoratorType(property: PropertyDeclaration): string | undefined {
    let decoratorType;

    property.getDecorators().map((decorator) => {
      const args = decorator.getArguments();
      const type = args.find((arg) => arg.getText().includes('type'));

      if (!type) {
        return;
      }

      decoratorType = this.getDecoratorTypeValue(type.getText());
    });

    return decoratorType;
  }

  /**
   * Extracts the actual column type from a decorator type string.
   *
   * @private
   * @param {string} type - The decorator type string (e.g., '{ type: "float" }').
   * @returns {string | undefined} The extracted type or undefined if not found.
   */
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

  /**
   * Retrieves the relation type decorator (e.g., OneToMany) from a property.
   *
   * @private
   * @param {PropertyDeclaration} property - The property to inspect for relation decorators.
   * @returns {string | undefined} The relation type if found, or undefined otherwise.
   */
  private getRelationDecorator(property: PropertyDeclaration): string | undefined {
    const decorators = property.getDecorators().map((decorator) => decorator.getName());

    return decorators.find((decorator) => {
      if (Object.keys(TRelations).includes(decorator)) {
        return decorator;
      }
    });
  }

  private getPrimaryKeyColumnDecorator(property: PropertyDeclaration): string | undefined {
    const decorators = property.getDecorators().map((decorator) => decorator.getName());

    return decorators.find((decorator) => {
      if (decorator === 'PrimaryGeneratedColumn') {
        return decorator;
      }
    });
  }
}
