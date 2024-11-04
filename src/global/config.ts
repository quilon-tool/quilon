import path from "path";
import fs from "fs";

export class GlobalConfig {
  static readonly CONFIG_FILE = "quilon.json";

  static readonly CONFIG_PATH = path.join(process.cwd(), "quilon.json");
}
