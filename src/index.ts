import { Command } from "commander"
import { init } from "./commands/init";

const program = new Command();

// DEFAULT
program
  .name('Quilon')
  .description('Create ERDs out of your ORM Entities with ease.')
  .version('1.0.0')

// INIT
program
  .command("init")
  .description("Create a config file with default settings.")
  .action(init);

program.parse(process.argv);