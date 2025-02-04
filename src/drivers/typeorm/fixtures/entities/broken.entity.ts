import { PrimaryGeneratedColumn } from "../decorators";

export class Broken {
  @PrimaryGeneratedColumn()
  id!: string;
}
