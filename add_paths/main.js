'use strict';

const core  = require('@actions/core');
const exec  = require('@actions/exec');
const tc    = require('@actions/tool-cache');
const child = require('child_process');

function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = child.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\mingw64\\bin`);
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\usr\\bin`);

      core.exportVariable('MAKE', `${topDir}/msys64/usr/bin/make.exe`);

      const newPath = process.env['PATH'].replace(/[^;]+?(Strawberry|CMake|OpenSSL)[^;]*;/g, '');
      core.exportVariable('PATH', newPath);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

