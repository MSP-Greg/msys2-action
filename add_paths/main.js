'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');

function cleanPath() {
    const newPath = process.env['PATH'].replace(/[^;]+?(Strawberry|CMake|OpenSSL)[^;]*;/g, '');
    process.env['PATH'] = newPath;
}

function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = c_proc.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\mingw64\\bin`);
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\usr\\bin`);

      process.env['MAKE'] = `${topDir}/msys64/usr/bin/make.exe`;
      process.env.MAKE    = `${topDir}/msys64/usr/bin/make.exe`;
      cleanPath();
      console.log(`MAKE=${process.env['MAKE']}`);
      console.log(`PATH=${process.env['PATH']}`);
      
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

