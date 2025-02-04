import fs from "fs";
import path from "path";

import { glob } from "glob";

export class FileSystemUtils {
  /**
   * Reads and parses a JSON file from the specified path.
   *
   * @template T The type of the parsed JSON object.
   * @param {string} path - The path of the JSON file to read.
   * @returns {T} The parsed JSON content as an object of type T.
   * @throws {Error} If the file cannot be read or parsed.
   */
  static readAndParseJSONFile<T>(path: string): T {
    const fileBuffer = fs.readFileSync(path);

    return JSON.parse(fileBuffer.toString());
  }

  /**
   * Reads all files in a directory that match a specified filename pattern.
   *
   * @param {string} directory - The directory to search within.
   * @param {string} fileNamePattern - The glob pattern to match file names.
   * @returns {Promise<string[]>} A promise that resolves to an array of matching file paths.
   */
  static async readFilesFromDirectory(directory: string, fileNamePattern: string): Promise<string[]> {
    const directoryPath = path.resolve(directory);

    return glob(`${directoryPath}/**/${fileNamePattern}`);
  }
}
