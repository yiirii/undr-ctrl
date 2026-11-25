// Builds the Windows installer on Linux without running Wine.
// electron-builder normally runs a helper .exe under Wine to produce the uninstaller; it also has a
// built-in reader that pulls the uninstaller straight out of that helper (used on some Macs).
// We make it take that path, so the build works even where Wine is broken.
const mv = require('app-builder-lib/out/util/macosVersion');
mv.isMacOsCatalina = () => true;
const { build, Platform } = require('electron-builder');
build({ targets: Platform.WINDOWS.createTarget(['nsis'], require('builder-util').Arch.x64), publish: 'never' })
  .then((files) => console.log('built', files.join(', ')))
  .catch((e) => { console.error(e); process.exit(1); });
