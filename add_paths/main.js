'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');
const env    = process.env;

function cleanPath() {
  const newPath = process.env['PATH'].replace(/[^;]+?(Strawberry|CMake|OpenSSL)[^;]*;/g, '');
  env['PATH'] = newPath;
}

function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = c_proc.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\mingw64\\bin`);
      core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\usr\\bin`);

      env['MAKE'] = `${topDir}/msys64/usr/bin/make.exe`;
      env.MAKE    = `${topDir}/msys64/usr/bin/make.exe`;
      cleanPath();
      console.log(`MAKE=${env['MAKE']}`);
      console.log(`PATH=${env['PATH']}`);
      
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

