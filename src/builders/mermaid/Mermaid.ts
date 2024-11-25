import { IEntityData } from '../../drivers/types';
import { IBuilder } from '../types';

export class MermaidBuilder implements IBuilder {
  readonly fileExtension = 'mmd';

  // TODO: Type keys with Relations
  private mappedRelationTypes = {
    OneToMany: '||--o{',
    ManyToOne: 'o{--||',
    OneToOne: '||--||',
    ManyToMany: 'o{--o{',
  };

  private diagram = '';

  private processedRelations = new Set<string>();

  constructor() {
    this.diagram = 'erDiagram\n';
  }

  /**
   * Returns the current state of the generated diagram.
   *
   * @returns {string} The Mermaid formatted diagram.
   */
  getDiagram(): string {
    return this.diagram;
  }

  /**
   * Appends an entity, including its table name, columns, and relations, to the diagram.
   *
   * @param {IEntityData} entity - The entity data to add to the diagram.
   */
  appendEntity(entity: IEntityData): void {
    this.appendTableName(entity);
    this.appendColumns(entity);
    this.appendRelations(entity);

    this.diagram += '\n';
  }

  /**
   * Appends the table name for the given entity to the diagram.
   *
   * @private
   * @param {IEntityData} entity - The entity whose table name is to be added.
   */
  private appendTableName(entity: IEntityData): void {
    this.diagram += `  ${entity.name}`;
  }

  /**
   * Appends columns for the given entity to the diagram.
   *
   * @private
   * @param {IEntityData} entity - The entity whose columns are to be added.
   */
  private appendColumns(entity: IEntityData): void {
    this.diagram += ' {\n';

    entity.columns.forEach((column) => {
      this.diagram += `    ${column.type} ${column.name}\n`;
    });

    this.diagram += '  }\n';
  }

  /**
   * Appends relations for the given entity to the diagram, avoiding duplicate relations.
   *
   * @private
   * @param {IEntityData} entity - The entity whose relations are to be added.
   */
  private appendRelations(entity: IEntityData): void {
    entity.relations.forEach((relation) => {
      const relatedEntityName = relation.type;
      const relationType = this.mappedRelationTypes[relation.relation];

      const relationKey = `${entity.name}-${relatedEntityName}`;
      const reverseRelationKey = `${relatedEntityName}-${entity.name}`;

      // Check if the relation or its reverse has already been processed (For mermaid, one is enough)
      if (!this.processedRelations.has(relationKey) && !this.processedRelations.has(reverseRelationKey)) {
        this.diagram += `  ${entity.name} ${relationType} ${relatedEntityName}: "${relation.relation}"\n`;
        this.processedRelations.add(relationKey);
      }
    });
  }
}
