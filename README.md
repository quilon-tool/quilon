# Quilon

Quilon is a lightweight and flexible library that automates the generation of Entity-Relationship Diagrams (ERD) from your application’s entities. Thanks to its architecture, it allows for easy extension to support additional ORMs and diagramming languages in the future.

### Supported ORMs and Diagram Languages

| **ORM**                | **Supported**  |
|------------------------|----------------|
| TypeORM                | ✅             |


| **Diagram Language**   | **Supported** |
|------------------------|---------------|
| Mermaid                | ✅             |

# Features

### 🔥 Automated ERD Generation
Generate ERD code with minimal configuration.

### 🖥️ Extensible Architecture
Easily add support for other ORMs and diagramming languages.

### 👨🏻‍💻 Developer-Friendly
Focuses on productivity with a simple API and clear outputs.

# Installation

```bash
npm install quilon
```

# Usage

### Init

```bash
npx quilon init
```

This creates a pre-configured `quilon.json` in the root of your project. Out of the box it looks like this:

```json
{
  "$schema": "https://raw.githubusercontent.com/quilon-tool/quilon/main/src/config/config-schema.json",
  "entities": [],
  "orm": "TypeORM",
  "diagramLanguage": "Mermaid",
  "outputDir": "./diagrams"
}
```

To kick things off, add files or directories to the `entities` Array:

```json
{
  "$schema": "https://raw.githubusercontent.com/quilon-tool/quilon/main/src/config/config-schema.json",
  "entities": ["myentity.ts", "./src/entities"],
  "orm": "TypeORM",
  "diagramLanguage": "Mermaid",
  "outputDir": "./diagrams"
}
```

Now, `Quilon` is ready to read your provided entity files and convert them into the specified diagram language.

---

### Generate

To generate the code in the specific diagram language:

```bash
npx quilon generate
```

This will generate a new `erd` file in the given diagram language inside the `./diagrams` directory in the root of your project.

# Feedback and Support

If you encounter any issues or have suggestions for new features, feel free to open an issue or a new Pull Request on GitHub. We’d love to hear your feedback!

# License

Quilon is licensed under the [MIT License](https://github.com/quilon-tool/quilon/blob/main/LICENSE).