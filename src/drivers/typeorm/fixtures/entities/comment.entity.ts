import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from '../decorators';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user.comments)
  user!: User;
}
