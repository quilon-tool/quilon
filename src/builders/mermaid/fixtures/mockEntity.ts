import { IEntityData, TRelations } from '../../../drivers/types';

export const mockEntity: IEntityData = {
  name: 'MockEntity',
  columns: [
    { name: 'id', type: 'varchar' },
    { name: 'age', type: 'integer' },
  ],
  relations: [{ name: 'MockEntity', type: 'RelatedEntity', relation: TRelations.OneToMany }],
};
