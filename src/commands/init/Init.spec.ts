import fs from 'fs';
import { InitCommand } from './Init';
import { GlobalConfig } from '../../global/config';
import { ORMs, DiagramLanguages } from '../../global/types';

jest.mock('fs');

describe('InitCommand', () => {
  let initCommand: InitCommand;

  beforeEach(() => {
    initCommand = new InitCommand();
    jest.clearAllMocks();
  });

  test('should not create the config file if it already exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const executeSpy = jest.spyOn(initCommand, 'execute');

    initCommand.execute();

    expect(fs.existsSync).toHaveBeenCalledWith(GlobalConfig.CONFIG_PATH);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(`${GlobalConfig.CONFIG_FILE} already exists.`);
    expect(executeSpy).toHaveReturned();

    consoleErrorSpy.mockRestore();
  });

  test('should create the config file if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    initCommand.execute();

    expect(fs.existsSync).toHaveBeenCalledWith(GlobalConfig.CONFIG_PATH);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      GlobalConfig.CONFIG_PATH,
      JSON.stringify(
        {
          $schema: 'https://raw.githubusercontent.com/quilon-tool/quilon/main/src/config/config-schema.json',
          entities: [],
          orm: ORMs.TypeORM,
          diagramLanguage: DiagramLanguages.Mermaid,
          outputDir: GlobalConfig.OUTPUT_DIR,
        },
        null,
        2
      )
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(`${GlobalConfig.CONFIG_FILE} successfully created.`);

    consoleLogSpy.mockRestore();
  });

  test('should handle errors during file write gracefully', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Write error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => initCommand.execute()).toThrow('Write error');
    expect(fs.existsSync).toHaveBeenCalledWith(GlobalConfig.CONFIG_PATH);
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
