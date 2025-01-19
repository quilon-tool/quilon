import { mockEntity } from './fixtures/mockEntity';
import { MermaidBuilder } from './Mermaid';

const mermaidBuilder = new MermaidBuilder();

describe('Mermaid', () => {
  it('should be defined', () => {
    expect(mermaidBuilder).toBeDefined();
  });

  describe('appendEntity', () => {
    it('should append the entity to the diagram', () => {
      const resultPattern = new RegExp(
        `
        erDiagram\\s*
        MockEntity \\{\\s*
          varchar id\\s*
          integer age\\s*
        \\}\\s*
        MockEntity \\|\\|--o\\{ RelatedEntity: "OneToMany"
      `
          .trim()
          .replace(/\s+/g, '\\s*')
      );

      mermaidBuilder.appendEntity(mockEntity);

      const diagram = mermaidBuilder.getDiagram();

      expect(diagram).toMatch(resultPattern);
    });
  });

  it('should call the correct private methods', () => {
    const appendTableNameSpy = jest.spyOn(mermaidBuilder as any, 'appendTableName');
    const appendColumnsSpy = jest.spyOn(mermaidBuilder as any, 'appendColumns');
    const appendRelationsSpy = jest.spyOn(mermaidBuilder as any, 'appendRelations');

    mermaidBuilder.appendEntity(mockEntity);

    expect(appendTableNameSpy).toHaveBeenCalledWith(mockEntity);
    expect(appendColumnsSpy).toHaveBeenCalledWith(mockEntity);
    expect(appendRelationsSpy).toHaveBeenCalledWith(mockEntity);
  });
});
