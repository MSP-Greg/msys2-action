'use strict';

const core   = require('@actions/core');
const exec   = require('@actions/exec');
const tc     = require('@actions/tool-cache');
const c_proc = require('child_process');

async function run() {
  try {
    if (process.platform === 'win32') {
      const topDir = c_proc.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();

      process.env['PATH'] = process.env['PATH'].replace(/C:\\Strawberry[^;]*;/gu, '');

      await core.addPath(`${topDir}/msys64/mingw64/bin`);
      await core.addPath(`${topDir}/msys64/usr/bin`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
