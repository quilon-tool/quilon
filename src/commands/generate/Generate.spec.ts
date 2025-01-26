import fs from 'fs';
import path from 'path';
import { GenerateCommand } from './Generate';
import { FileSystemUtils } from '../../utils/filesystem';
import { Driver } from '../../drivers/Driver';
import { Builder } from '../../builders/Builder';
import { GlobalConfig } from '../../global/config';

jest.mock('fs');
jest.mock('../../utils/filesystem');
jest.mock('../../drivers/Driver');
jest.mock('../../builders/Builder');

describe('GenerateCommand', () => {
  let generateCommand: GenerateCommand;
  let mockConfigFile: any;
  let mockFiles: string[];
  let mockDiagram: string;

  beforeEach(() => {
    generateCommand = new GenerateCommand();
    jest.clearAllMocks();

    mockConfigFile = {
      entities: ['src/entities'],
      outputDir: 'output',
    };

    mockFiles = ['src/entities/User.ts', 'src/entities/Post.ts'];
    mockDiagram = 'MockDiagramContent';

    (FileSystemUtils.readAndParseJSONFile as jest.Mock).mockReturnValue(mockConfigFile);
    (FileSystemUtils.readFilesFromDirectory as jest.Mock).mockResolvedValue(mockFiles);

    const mockDriver = {
      getFileNamePattern: jest.fn().mockReturnValue('*.ts'),
      setFilePath: jest.fn(),
      parseEntity: jest.fn().mockReturnValue('MockEntity'),
    };

    const mockBuilder = {
      appendEntity: jest.fn(),
      getDiagram: jest.fn().mockReturnValue(mockDiagram),
      fileExtension: 'md',
    };

    (Driver as jest.Mock).mockImplementation(() => mockDriver);
    (Builder as jest.Mock).mockImplementation(() => mockBuilder);
  });

  test('should throw an error if no entities are found in the config file', async () => {
    (FileSystemUtils.readAndParseJSONFile as jest.Mock).mockReturnValueOnce({ entities: [] });

    await expect(generateCommand.execute()).rejects.toThrow('No entities found');
  });

  test('should create output directory if it does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await generateCommand.execute();

    expect(fs.existsSync).toHaveBeenCalledWith(mockConfigFile.outputDir);
    expect(fs.mkdirSync).toHaveBeenCalledWith(mockConfigFile.outputDir);
  });

  test('should not create output directory if it already exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await generateCommand.execute();

    expect(fs.existsSync).toHaveBeenCalledWith(mockConfigFile.outputDir);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  test('should process entities and create the diagram file', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await generateCommand.execute();

    const expectedFileName = path.join(mockConfigFile.outputDir, `${GlobalConfig.DIAGRAM_FILE_NAME}.mmd`);

    expect(FileSystemUtils.readFilesFromDirectory).toHaveBeenCalledWith('src/entities', '*.ts');
    expect(fs.writeFileSync).toHaveBeenCalledWith(expectedFileName, mockDiagram);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  test('should handle errors during diagram generation gracefully', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Write error');
    });

    await expect(generateCommand.execute()).rejects.toThrow('Write error');

    const expectedFileName = path.join(mockConfigFile.outputDir, `${GlobalConfig.DIAGRAM_FILE_NAME}.md`);

    expect(FileSystemUtils.readFilesFromDirectory).toHaveBeenCalledWith('src/entities', '*.ts');
    expect(fs.writeFileSync).toHaveBeenCalledWith(expectedFileName, mockDiagram);
  });
});
