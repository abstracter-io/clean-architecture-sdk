const micromatch = require('micromatch');

// https://github.com/okonet/lint-staged
module.exports = (allStagedFiles) => {
  const commands = [];
  const lintables = micromatch(allStagedFiles, ['**/*.js', '**/*.ts'], {});
  const testables = micromatch(allStagedFiles, ['src/**', 'tests/**'], {});

  if (lintables.length) {
    commands.push(`npm run lint:fix -- ${lintables.join(' ')}`);
  }

  if (testables.length) {
    commands.push('npm test');
  }

  return commands;
};
