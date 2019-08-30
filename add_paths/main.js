'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');


function cleanPath(path) {
  const newPath = path.replace(/[^;]+?(Strawberry|CMake|OpenSSL )[^;]*;/g, '');
  process.env['PATH'] = newPath;
}

async function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = c_proc.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();

      await core.addPath(`${topDir}/msys64/mingw64/bin`);
      await core.addPath(`${topDir}/msys64/usr/bin`);

      cleanPath(process.env['PATH']);
      console.log('--------------------------------------');
      console.log(process.env['PATH']);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
