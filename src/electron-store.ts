/**
 * 内置 electron-store
 * 内置理由：v9之前只支持cjs，v9之后只支持esm。配合vite使用时，开发环境需要使用esm模式
 */

import process from 'node:process';
import path from 'node:path';

import electron from 'electron';
import Conf, { type Options as ConfigOptions } from 'conf';

export { Schema } from 'conf';

let isInitialized = false;

// Set up the `ipcMain` handler for communication between renderer and main process.
const initDataListener = () => {
  if (!electron.ipcMain || !electron.app) {
    throw new Error(
      'Electron Store: You need to call `.initRenderer()` from the main process.',
    );
  }

  const appData = {
    defaultCwd: electron.app.getPath('userData'),
    appVersion: electron.app.getVersion(),
  };

  if (isInitialized) {
    return appData;
  }

  electron.ipcMain.on('electron-store-get-data', (event) => {
    event.returnValue = appData;
  });

  isInitialized = true;

  return appData;
};

export namespace ElectronStore {
  export type Options<T extends Record<string, any>> = Omit<
    ConfigOptions<T>,
    'configName' | 'projectName' | 'projectVersion' | 'projectSuffix'
  > & {
    /**
    Name of the storage file (without extension).
  
    This is useful if you want multiple storage files for your app. Or if you're making a reusable Electron module that persists some data, in which case you should **not** use the name `config`.
  
    @default 'config'
    */
    readonly name?: string;
  };
}

export class ElectronStore<
  T extends Record<string, any> = Record<string, unknown>,
> extends Conf<T> {
  constructor(o: ElectronStore.Options<T>) {
    let defaultCwd = '';
    let appVersion = '';

    // If we are in the renderer process, we communicate with the main process
    // to get the required data for the module otherwise, we pull from the main process.
    if (process.type === 'renderer') {
      const appData = electron.ipcRenderer.sendSync('electron-store-get-data');

      if (!appData) {
        throw new Error(
          'Electron Store: You need to call `.initRenderer()` from the main process.',
        );
      }

      ({ defaultCwd, appVersion } = appData);
    } else if (electron.ipcMain && electron.app) {
      ({ defaultCwd, appVersion } = initDataListener());
    }

    const opts: ConfigOptions<T> & { name?: string } = { name: 'config', ...o };

    opts.projectVersion ||= appVersion;

    if (opts.cwd) {
      opts.cwd = path.isAbsolute(opts.cwd)
        ? opts.cwd
        : path.join(defaultCwd, opts.cwd);
    } else {
      opts.cwd = defaultCwd;
    }

    opts.configName = opts.name;
    delete opts.name;

    super(opts);
  }

  static initRenderer() {
    initDataListener();
  }

  async openInEditor() {
    const error = await electron.shell.openPath(this.path);

    if (error) {
      throw new Error(error);
    }
  }
}
