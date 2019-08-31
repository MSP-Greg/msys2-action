'use strict';

const core  = require('@actions/core');
const exec  = require('@actions/exec');
const tc    = require('@actions/tool-cache');
const child = require('child_process');
const fs    = require('fs');

async function run() {
  try {
    if (process.platform === 'win32') {
      const rubyABIVers = child.execSync(`ruby.exe -e "puts RbConfig::CONFIG['ruby_version']"`).toString().trim();

      if (rubyABIVers >= '2.5') {
        const openssl = 'mingw-w64-x86_64-openssl';
        await exec.exec(`pacman.exe -S --noconfirm --needed --noprogressbar ${openssl}`);
      } else {
        const openssl_2_4 = 'https://sourceforge.net/projects/msys2/files/REPOS/MINGW/x86_64/mingw-w64-x86_64-openssl-1.0.2.p-1-any.pkg.tar.xz'
        const openssl_2_4_path = await tc.downloadTool(openssl_2_4);
        
        await exec.exec(`pacman.exe -Udd --noconfirm --noprogressbar ${openssl_2_4_path}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
