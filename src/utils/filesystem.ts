import fs from "fs";
import config from "../global/config";
import { IConfigFile } from "../global/types";

export class FileSystemUtils {
  static readAndParseJSONFile<T>(path: string): T {
    const fileBuffer = fs.readFileSync(path);
    
    return JSON.parse(fileBuffer.toString());
  }
}
