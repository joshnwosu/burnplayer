const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const { ipcRenderer, remote } = require('electron');
const storage = require('electron-json-storage');
storage.getDataPath();
// let dirStore = [remote.app.getPath('music')];
let dirStore = [];

const names = () => {
  return ['Joshua', 'Jerry', 'Gift', 'Janet', 'Great', 'Mom', 'Dad'];
};

const getDirectory = async () => {
  //   let dirStore = [];

  ipcRenderer.on('selectedItem', (ev, path) => {
    // dirStore.push(path);
    dirStore = [...dirStore, path];
  });

  return await dirStore;
};

export { names, getDirectory };
