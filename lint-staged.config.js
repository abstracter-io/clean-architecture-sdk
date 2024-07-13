const micromatch = require('micromatch');

// https://github.com/okonet/lint-staged
module.exports = (allStagedFiles) => {
  const commands = [];
  const files = micromatch(allStagedFiles, ['**/*.js', '**/*.ts']);

  if (files.length) {
    commands.push(`npm run lint -- ${files.join(' ')}`);
    commands.push('npm test');
  }

  return commands;
};
