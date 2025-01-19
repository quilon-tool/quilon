import { TypeORMDriver } from './Typeorm';
import path from 'path';

describe('TypeORMDriver', () => {
  it('should call the correct private methods', () => {
    const entityPath = path.resolve(__dirname, './fixtures/entities/user.entity.ts');

    const driver = new TypeORMDriver(entityPath);

    const extractTableNameSpy = jest.spyOn(driver as any, 'extractTableName');
    const extractColumnsSpy = jest.spyOn(driver as any, 'extractColumns');
    const extractRelationsSpy = jest.spyOn(driver as any, 'extractRelations');

    driver.parseEntity();

    expect(extractTableNameSpy).toHaveBeenCalled();
    expect(extractColumnsSpy).toHaveBeenCalled();
    expect(extractRelationsSpy).toHaveBeenCalled();
  });

  it('should parse the User entity and extract table name, columns, and relations', () => {
    const entityPath = path.resolve(__dirname, './fixtures/entities/user.entity.ts');

    const driver = new TypeORMDriver(entityPath);
    const entityData = driver.parseEntity();

    // Strip the "import" from the relation string
    entityData.relations.forEach((relation) => {
      relation.type = relation.type.replace(/import\(".*"\)\./, '');
    });

    const expectedData = {
      name: 'User',
      columns: [
        { name: 'id "(PK)"', type: 'varchar' },
        { name: 'age ', type: 'integer' },
      ],
      relations: [{ name: 'comments', type: 'Comment', relation: 'OneToMany' }],
    };

    expect(entityData).toEqual(expectedData);
  });

  it('should parse the Comment entity and extract table name, columns, and relations', () => {
    const entityPath = path.resolve(__dirname, './fixtures/entities/comment.entity.ts');

    const driver = new TypeORMDriver(entityPath);
    const entityData = driver.parseEntity();

    // Strip the "import" from the relation string
    entityData.relations.forEach((relation) => {
      relation.type = relation.type.replace(/import\(".*"\)\./, '');
    });

    const expectedData = {
      name: 'Comment',
      columns: [
        { name: 'id "(PK)"', type: 'varchar' },
        { name: 'content ', type: 'varchar' },
        { name: 'userId "(FK)"', type: 'varchar' },
      ],
      relations: [{ name: 'user', type: 'User', relation: 'ManyToOne' }],
    };

    expect(entityData).toEqual(expectedData);
  });

  it('should throw an Error if the entity is not a valid TypeORM entity', () => {
    const entityPath = path.resolve(__dirname, './fixtures/entities/broken.entity.ts');

    const driver = new TypeORMDriver(entityPath);

    expect(() => driver.parseEntity()).toThrow();
  });
});
