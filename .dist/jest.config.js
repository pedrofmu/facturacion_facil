"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
