'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');

async function run() {
  try {
    if (process.platform === 'win32') {
      const rubyTopDir = c_proc.spawnSync('ruby.exe -e "STDOUT.write RbConfig::TOPDIR"');
      const topDir = rubyTopDir.stdout.trim();

      await core.addPath(`${topDir}/msys64/mingw64/bin`);
      await core.addPath(`${topDir}/msys64/usr/bin`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
