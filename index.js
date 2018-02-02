#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const argv = process.argv.slice(2);

console.log('parent directory is', process.cwd(), 'command is git', ...argv);

if (argv.length < 1) {
  console.log('Usage: g <command>');
  process.exit(0);
}

// 遍历当前文件夹 excluding '.' and '..'
const files = fs.readdirSync(process.cwd());

files.forEach((file) => {
  console.log(`\x1b[32m${file}\x1b[39m`);
  const stats = fs.statSync(file);
  if (stats.isDirectory()) {
    if (fs.readdirSync(file).indexOf('.git') === -1) {
      console.log('Not a GIT repository');
    } else {
      //

    }
    const command = spawn('git', argv, { stdio: 'inherit' });
    // command.stdout.pipe(process.stdout);
    //
    // command.stderr.pipe(process.stderr);
    command.on('close', (code) => {
      console.log(code);
    });
  } else {
    console.log('Not a GIT repository');
  }
});
