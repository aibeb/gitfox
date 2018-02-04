#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const argv = process.argv.slice(2);

console.log(`parent directory is \x1b[32m${process.cwd()}\x1b[39m command is \x1b[32mgit ${argv.join(' ')}\x1b[39m`);

if (argv.length < 1) {
  console.log('Usage: g <command>');
  process.exit(0);
}

// 遍历当前文件夹 excluding '.' and '..'
fs.readdirSync(process.cwd()).map(async (file) => {
  try {
    const stats = fs.statSync(file);
    if (stats.isDirectory() && fs.readdirSync(file).indexOf('.git') !== -1) {
      const { stdout, stderr } = await exec(`git ${argv.join(' ')}`, { cwd: file });
      console.log(`\x1b[32m${file}\x1b[39m`);
      if (stderr) {
        console.error(`\x1b[31m${stderr}\x1b[31m`);
      }
      console.log(stdout);
    } else {
      console.log(`\x1b[32m${file}\x1b[39m`);
      console.log('Not a GIT repository');
    }
  } catch (error) {
    console.log(`\x1b[32m${file}\x1b[39m`);
    console.error(`\x1b[31m${error.stdout}\x1b[31m`);
  }
});
