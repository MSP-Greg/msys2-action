'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');

function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = c_proc.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim().replace(/\//g, "\\");;
      core.addPath(`${topDir}\\msys64\\mingw64\\bin`);
      core.addPath(`${topDir}\\msys64\\usr\\bin`);

      core.cleanPath();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
