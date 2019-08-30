'use strict';

const core  = require('@actions/core');
const exec  = require('@actions/exec');
const tc    = require('@actions/tool-cache');
const child = require('child_process');

function run() {
  try {
    if (process.platform === 'win32') {
      const rubyABIVers = child.execSync(`ruby.exe -e "puts RbConfig::CONFIG['ruby_version']"`).toString().trim();

      if (rubyABIVers >= '2.5') {
        const openssl = 'mingw-w64-x86_64-openssl';
        exec.exec(`pacman.exe -Syu --noconfirm --needed --noprogressbar`);
        exec.exec(`pacman.exe -S --noconfirm --needed --noprogressbar ${openssl}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
