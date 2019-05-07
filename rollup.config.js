import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    external: ['scrape-it', 'turndown', 'striptags'],
    output: [
      { file: pkg.main, format: 'cjs' },
    ],
  },
];
