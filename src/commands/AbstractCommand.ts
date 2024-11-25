export abstract class AbstractCommand {
  constructor() {
    this.execute = this.execute.bind(this);
  }

  abstract execute(): void;
}
