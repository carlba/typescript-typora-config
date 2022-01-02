import { Profile } from './profile.interface';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import * as plist from 'simple-plist';
import * as lodash from 'lodash';
import { diffString } from 'json-diff';

const homedir = os.homedir();

async function main() {
  const windowsSettings = JSON.parse(
    Buffer.from(await fs.readFile(path.join(__dirname, 'profile.data'), 'ascii'), 'hex').toString(
      'utf8'
    )
  );

  const macosSettings = plist.readFileSync<Profile>(
    path.join(homedir, 'Library/Preferences/abnerworks.Typora.plist')
  );


  const exclusions = [
    'NSWindow Frame SUUpdateAlert',
    'NSNavPanelExpandedSizeForOpenMode',
    'sentry.io.tags', // Exists in both but is not relevant
    'sentry.io.user', // Exists in both but is not relevant
    'NSDocumentSuppressTempVersionStoreWarning',
    'WebAutomaticDashSubstitutionEnabled',
    'NSWindow Frame NSSpellCheckerSubstitutionsPanel2',
    'NSDocumentSuppressTempVersionStoreWarning',
    'NSWindow Frame NSNavPanelAutosaveName',
    'NSNavLastRootDirectory',
    'SUAutomaticallyUpdate',
    'NSNavLastUserSetHideExtensionButtonState',
    'kCountlyStoredDeviceIDKey',
    'NSNavPanelExpandedSizeForSaveMode',
    'NSWindow Frame _ClosedWindowFrame',
    'SUHasLaunchedBefore',
    'SUUpdateGroupIdentifier',
    'SUUpdateRelaunchingMarker',
    'SULastCheckTime',
    'SUEnableAutomaticChecks',
    'WebContinuousSpellCheckingEnabled',
    'WebAutomaticQuoteSubstitutionEnabled',
    'NSWindow Frame SUStatusFrame',
    'recentFolder',
    'backgroundColor2',
    'autoUpdateToDev',
    'use_seamless_window', // Only windows
    'verInitTime', // Exists in both but is not relevant
    'lastClosedBounds',
    'framelessWindow', // MacOS equivalent of use_seamless_window
    'export.epub', // Exists in both but is not relevant
    'didShowWelcomePanel2',
    'isFocusMode', // Exists in both but is not relevant
    'send_usage_info' // Exists in both but is not relevant

  ]

  console.log(diffString(lodash.omit(macosSettings, exclusions), lodash.omit(windowsSettings, exclusions)));

  fs.writeFile(
    path.join(__dirname, 'profile.macos.json'),
    JSON.stringify(macosSettings, undefined, 2)
  );
  fs.writeFile(
    path.join(__dirname, 'profile.windows.json'),
    JSON.stringify(windowsSettings, undefined, 2)
  );
}

main();
