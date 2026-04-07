import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'graphql/schema.graphql', // Point to local schema file
  documents: ['graphql/**/*.ts'],   // Scan operations in graphql/
  ignoreNoDocuments: true,
  generates: {
    './graphql/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false, // For simpler usage in this sprint
      },
    },
  },
};

export default config;
