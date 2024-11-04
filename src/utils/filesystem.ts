import fs from "fs";

export class FileSystemUtils {
  static readAndParseJSONFile<T>(path: string): T {
    const fileBuffer = fs.readFileSync(path);
    
    return JSON.parse(fileBuffer.toString());
  }
}
