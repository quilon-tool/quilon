import { Command } from "commander";
import { generate } from "../commands/generate";
import { InitCommand } from "../commands/init/InitCommand";

export class Quilon {
  private program: Command;

  constructor() {
    this.program = new Command();
  }

  setup() {
    this.configure();
    this.setupCommands();
    this.program.parse(process.argv);
  }

  private configure() {
    this.program
      .name("Quilon")
      .description("Create ERDs out of your ORM Entities with ease.")
      .version("1.0.0");
  }

  private setupCommands() {
    this.init();
    this.generate();
  }

  private init() {
    const command = new InitCommand();

    this.program
      .command("init")
      .description("Create a config file with default settings.")
      .action(command.execute);
  }

  private generate() {
    this.program
      .command("generate")
      .description("Generate your ERD with the specified settings.")
      .action(generate);
  }
}