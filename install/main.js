"use strict";

const core = require("@actions/core");
const exec = require("@actions/exec");
const tc   = require("@actions/tool-cache");

async function run() {
  try {
    if (process.platform === 'win32') {
      const msys2Path = await tc.downloadTool('https://sourceforge.net/projects/msys2/files/Base/x86_64/msys2-base-x86_64-20190524.tar.xz');
      // change to unix style paths

      const runnerTempFwd  = process.env.RUNNER_TEMP.replace(/\\/g, '/');
      const runnerTempUnix = `/${runnerTempFwd.replace(':', '')}`;

      const fn = `/${msys2Path.replace(/\\/g, '/').replace(':', '')}`;
      const rtc = `/${process.env.RUNNER_TOOL_CACHE.replace(/\\/g, '/').replace(':', '')}`;

      await exec.exec(`"C:/Program Files/Git/usr/bin/tar.exe" -x --xz -C ${rtc} -f ${fn}`);

      const userBin = `${process.env.RUNNER_TOOL_CACHE}/msys64/usr/bin`;

      await core.addPath(userBin);
      await core.addPath(`${process.env.RUNNER_TOOL_CACHE}/msys64/mingw64/bin`);

      // setup and update MSYS2
      await exec.exec(`bash.exe -c "pacman-key --init"`);
      await exec.exec(`bash.exe -c "pacman-key --populate msys2"`);
      await exec.exec(`bash.exe -c "pacman-key --refresh-keys"`);
      await exec.exec('pacman.exe -Syu --noconfirm --needed --noprogressbar');
      await exec.exec('pacman.exe -Su  --noconfirm --needed --noprogressbar');
      await exec.exec('pacman.exe -S   --noconfirm --needed --noprogressbar base base-devel compression');

      const pre = 'mingw-w64-x86_64-';
      const ruby = "___gdbm ___gettext ___gmp ___libffi ___libyaml ___openssl ___ragel ___readline ___termcap ___zlib".replace(/___/g, pre);

      await exec.exec(`pacman.exe -S   --noconfirm --needed --noprogressbar ${pre}toolchain`);
      await exec.exec(`pacman.exe -S   --noconfirm --needed --noprogressbar ${ruby}`);

      process.env['PATH'] = process.env['PATH'].replace(/C:\\Strawberry\\[^;]+;/g, '');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
