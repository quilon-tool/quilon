import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "../decorators";

import { Comment } from "./comment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  age!: number;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}
