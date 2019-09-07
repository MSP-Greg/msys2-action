'use strict';

const core = require('@actions/core');
const exec = require('@actions/exec');
const tc   = require('@actions/tool-cache');

function run() {
  try {
    if (process.platform === 'win32') {
      // setup and update MSYS2
      exec.exec(`bash.exe -c "pacman-key --init"`);
      exec.exec(`bash.exe -c "pacman-key --populate msys2"`);
      exec.exec('pacman.exe -Syu');
      exec.exec('pacman.exe -Su');
      const args = '--noconfirm --noprogressbar';
      const pre  = ' mingw-w64-x86_64-';
      const pkgs = ['', 'ragel'].join(pre);
      exec.exec(`pacman.exe -S ${args} ${pkgs}`);
            // full update, takes too long
      // await exec.exec('pacman.exe -Syu --noconfirm --needed --noprogressbar');
      // await exec.exec('pacman.exe -Su  --noconfirm --needed --noprogressbar');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
