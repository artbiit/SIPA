import fs from 'fs';
import YAML from 'yaml';
import path from 'path';

// Absolute path to the YAML file inside the container
const yamlFilePath = path.join(process.cwd(), 'swagger.yaml');

const fileContents = fs.readFileSync(yamlFilePath, 'utf8');

const swaggerDocument = YAML.parse(fileContents);

export default swaggerDocument;
