'use strict';

const core = require('@actions/core');
const exec = require('@actions/exec');
const tc   = require('@actions/tool-cache');

async function run() {
  try {
    if (process.platform === 'win32') {
      // setup and update MSYS2
      await exec.exec(`bash.exe -c "pacman-key --init"`);
      await exec.exec(`bash.exe -c "pacman-key --populate msys2"`);
      const args = '--noconfirm --noprogressbar --needed';
      const pre  = ' mingw-w64-x86_64-';
      // full update, takes too long
      //await exec.exec(`pacman.exe -Syu ${args}`);
      //await exec.exec(`pacman.exe -Su  ${args}`);
      const pkgs = ['', 'binutils', 'crt', 'headers', 'isl', 'libiconv', 'mpc', 'gcc-libs', 'windows-default-manifest', 'winpthreads', 'zlib', 'gcc', 'ragel'].join(pre);
      await exec.exec(`pacman.exe -Sy ${args}`);
      await exec.exec(`pacman.exe -S  ${args} ${pkgs}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
