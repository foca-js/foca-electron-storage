# foca-electron-storage

electron 端的持久化引擎。

[![License](https://img.shields.io/github/license/foca-js/foca-electron-storage?logo=open-source-initiative)](https://github.com/foca-js/foca-electron-storage/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/foca-electron-storage?logo=npm)](https://www.npmjs.com/package/foca-electron-storage)

# 安装

```bash
# npm
npm install foca-electron-storage
# yarn
yarn add foca-electron-storage
# pnpm
pnpm add foca-electron-storage
```

# 使用

```diff
import { store } from 'foca';
+import { electronStorage } from 'foca-electron-storage';

store.init({
  persist: [
    {
      key: 'my-project',
      version: '1',
+     engine: electronStorage,
      models: [],
    },
  ],
});
```

也可以定制参数

```diff
import { store } from 'foca';
+import { createElectronStorage } from 'foca-electron-storage';

store.init({
  persist: [
    {
      key: 'my-project',
      version: '1',
+     engine: createElectronStorage({...}),
      models: [],
    },
  ],
});
```
