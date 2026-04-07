import { typeDefs } from '../../habit-coach-api/src/graphql/typeDefs';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'graphql/schema.graphql');
const cleanSchema = typeDefs.replace(/^#graphql\s*/, '');

fs.writeFileSync(schemaPath, cleanSchema);
console.log('Schema extracted to graphql/schema.graphql');
