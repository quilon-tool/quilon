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
      
      this.diagram += `  ${entity.name} ${relationType} ${relatedEntityName}: "${relation.relation}"\n`;
    });
  }
}