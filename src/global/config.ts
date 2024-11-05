import path from "path";

export class GlobalConfig {
  static readonly CONFIG_FILE = "quilon.json";

  static readonly CONFIG_PATH = path.join(process.cwd(), "quilon.json");

  static readonly OUTPUT_DIR = path.join(process.cwd(), "diagrams");

  static readonly DIAGRAM_FILE_NAME = "erd";
}
