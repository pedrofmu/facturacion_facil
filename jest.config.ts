export default {
  preset: 'ts-jest',  
  testEnvironment: 'node',  
  transform: {
    '^.+\\.ts?$': 'ts-jest',  
  },
  moduleFileExtensions: ['js'],  
  transformIgnorePatterns: ['<rootDir>/node_modules/'],  
};
