'use strict';

const core  = require('@actions/core');
const exec  = require('@actions/exec');
const tc    = require('@actions/tool-cache');
const child = require('child_process');

const args  = '--noconfirm --noprogressbar --needed';

const base  = core.getInput('base').trim().toLowerCase();
const msys2 = core.getInput('msys2').trim().toLowerCase();
var   mingw = core.getInput('mingw').trim().toLowerCase();

let t = child.execSync(`ruby.exe -e "puts (RbConfig::CONFIG['ruby_version'] + ' ' + RbConfig::CONFIG['arch'])"`).toString().trim().split(' ');
const rubyABIVers = t[0];
const bits = (t[1] === 'x64-mingw32') ? 64 : 32;

const prefix = (bits == 64) ? ' mingw-w64-x86_64-' : ' mingw-w64-i686-';

function addPath() {
  const newPath = process.env['PATH'].replace(/[^;]+?(Chocolatey|CMake|mingw64|OpenSSL|Strawberry)[^;]*;/g, '');
  core.exportVariable('PATH', newPath);

  const topDir = child.execSync(`ruby.exe -e "STDOUT.write RbConfig::TOPDIR"`).toString().trim();

  core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\usr\\bin`);
  core.addPath(`${topDir.replace(/\//g, "\\")}\\msys64\\mingw${bits}\\bin`);

  core.exportVariable('MAKE', `${topDir}/msys64/usr/bin/make.exe`);
}

async function openssl() {
  if (rubyABIVers >= '2.5') {
    const openssl = `${prefix}openssl`;
    await exec.exec(`pacman.exe -S ${args} ${openssl}`);
  } else {
    const openssl_2_4 = 'https://dl.bintray.com/larskanis/rubyinstaller2-packages/${prefix}openssl-1.0.2.s-1-any.pkg.tar.xz'
    const openssl_2_4_path = await tc.downloadTool(openssl_2_4);
    await exec.exec(`pacman.exe -Udd --noconfirm --noprogressbar ${openssl_2_4_path}`);
  }
}

async function updateGCC() {
  // full update, takes too long
  //await exec.exec(`pacman.exe -Syu ${args}`);
  //await exec.exec(`pacman.exe -Su  ${args}`);
  let gccPkgs = ['', 'binutils', 'crt', 'headers', 'isl', 'libiconv', 'mpc', 'gcc-libs', 'windows-default-manifest', 'winpthreads', 'zlib', 'gcc'];

  await exec.exec(`pacman.exe -S ${args} ${gccPkgs.join(prefix)}`);
}

async function runBase() {
  // setup and update MSYS2
  await exec.exec(`bash.exe -c "pacman-key --init"`);
  await exec.exec(`bash.exe -c "pacman-key --populate msys2"`);
  await exec.exec(`pacman.exe -Sy`);

  if (base.includes('update')) { await updateGCC(); };
}

async function runMingw() {
  if (mingw.includes('openssl')) {
    await openssl();
    mingw = mingw.replace('openssl', '').trim();
  }
  let ary = mingw.split(' ');
  ary.unshift('');
  await exec.exec(`pacman.exe -S ${args} ${ary.join(prefix)}`);
}

function runMSYS2() {
}

async function run() {
  try {
    if (process.platform === 'win32') {
      addPath();
      if (base  !== '') { await runBase()  };
      if (mingw !== '') { await runMingw() };
      if (msys2 !== '') { await runMSYS2() };
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();