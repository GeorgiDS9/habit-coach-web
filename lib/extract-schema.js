const { typeDefs } = require('../../habit-coach-api/src/graphql/typeDefs.ts');
const fs = require('fs');
fs.writeFileSync('graphql/schema.graphql', typeDefs.replace('#graphql', ''));
