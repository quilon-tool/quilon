import fs from "fs";
import { glob } from "glob";
import path from 'path';

export class FileSystemUtils {
  static readAndParseJSONFile<T>(path: string): T {
    const fileBuffer = fs.readFileSync(path);
    
    return JSON.parse(fileBuffer.toString());
  }

  static async readFilesFromDirectory(directory: string, fileNamePattern: string): Promise<string[]> {
    const directoryPath = path.resolve(directory);
    return glob(`${directoryPath}/**/${fileNamePattern}`);
  }
}
