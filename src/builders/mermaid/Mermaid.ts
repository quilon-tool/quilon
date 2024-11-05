import { IEntityData } from "../../drivers/types";
import { IBuilder } from "../types";

export class MermaidBuilder implements IBuilder {
  // TODO: Type keys with Relations
  private mappedRelationTypes = {
    OneToMany: "||--o{",
    ManyToOne: "o{--||",
    OneToOne: "||--||",
    ManyToMany: "o{--o{",
  };

  private diagram = "";

  private processedRelations = new Set<string>();

  constructor() {
    this.diagram = "erDiagram\n";
  }

  getDiagram(): string {
    return this.diagram;
  }

  appendEntity(entity: IEntityData): void {
    this.diagram += `  ${entity.name} {\n`;

    entity.columns.forEach((column) => {
      this.diagram += `    ${column.type} ${column.name}\n`;
    });

    this.diagram += `  }\n`;

    entity.relations.forEach((relation) => {
      const relatedEntityName = relation.type.replace(/\[\]/, '');
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