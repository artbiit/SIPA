import fs from 'fs';
import YAML from 'yaml';

const yamlFilePath = './swagger.yaml';

const fileContents = fs.readFileSync(yamlFilePath, 'utf8');

const swaggerDocument = YAML.parse(fileContents);

export default swaggerDocument;
