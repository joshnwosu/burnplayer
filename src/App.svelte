<script>
  import "./App.css";
  import Tabs from "./components/Tabs/Tabs.svelte";

  const { ipcRenderer } = require("electron");
  const fs = require("fs");
  const path = require("path");
  const mm = require("music-metadata");
  const chokidar = require("chokidar");

  const storage = require("electron-json-storage");
  storage.getDataPath();

  import {
    messageStore,
    progressStore,
    progressFileStore,
    folderStore,
    playerStore,
    totalFileLengthStore,
    AlertMessageStore,
    toggleNav,
    togglePlaylist,
  } from "./store/music";
  import convertDuration from "./utils/convertDuration";
  import Control from "./components/Control/Control.svelte";

  import Modal from "./components/Modal/Modal.svelte";

  import ContextMenu from "./utils/ContextMenu";
  import Playlist from "./components/Playlist/Playlist.svelte";
  import Search from "./components/Search/Search.svelte";

  new ContextMenu();

  let loading = false;
  let files = null;
  let songList = null;
  let player = null;
  var folder = [];
  let paths = [
    "/home/joshwebb/Music/nf",
    // "/home/joshwebb/Music/lucidious",
    // "/home/joshwebb/Music/felix-beats",
    // "/home/joshwebb/Music/cover",
    // "/home/joshwebb/Music/audio",
    // "/home/joshwebb/Music",
    // "/home/joshwebb/Music/trap",
    // "/home/joshwebb/Documents/fels/Download",
  ];
  // let paths = [];
  // let message;
  let watcher;
  let progress;
  let progressFile;
  let audio = new Audio();
  var totalFileLength = [];

  // $: $toggleNav;
  // $: $togglePlaylist;

  // storage.has("paths", (error, haskey) => {
  //   if (error) throw error;
  //   if (haskey) {
  //     storage.get("paths", (error, data) => {
  //       if (error) throw error;
  //       if (data && data.paths) {
  //         paths = [...paths, ...data.paths];
  //         if (paths.length > 0) {
  //           paths.forEach(async function (filePath) {
  //             scanDir(filePath);
  //           });
  //         }
  //       }
  //     });
  //   }
  // });

  // For testing purposes
  if (paths.length) {
    paths.forEach((p) => scanDir(p));
    // paths.forEach((p) => checkIfPathAlreadyIncluded(p));
  }

  function checkIfPathAlreadyIncluded(filePath) {
    let scannedDir = getScanDir(filePath);

    scannedDir.forEach((dir) => {
      if (!path.parse(dir).name.startsWith(".")) {
        let audioDir = checkIfDirHasFile(dir) ? true : false;
        // Checks if paths doesn't include the diretory and also has files in it
        if (!paths.includes(dir) && audioDir) {
          paths = [...paths, dir];
          scanDir(dir);
        }
        // Checks if paths includes the diretory and also has files in it
        else if (paths.includes(dir) && audioDir) {
          // AlertMessageStore.set({
          //   msg: "Directory Already Added. ",
          //   path: dir,
          //   layout: "growl",
          //   effect: "slide",
          //   type: "warning",
          // });
          // console.log({
          //   msg: "Directory Already Added. ",
          //   path: dir,
          // });
        } else {
          // AlertMessageStore.set({
          //   msg: "No audio file in directory ",
          //   path: dir,
          //   layout: "growl",
          //   effect: "scale",
          //   type: "error",
          // });
          // console.log("Directory doesn't  contain any song");
          // console.log({
          //   msg: "Directory doesn't  contain any song",
          //   path: dir,
          // });
        }
      }
    });
  }

  function checkIfDirHasFile(dir) {
    var files = fs.readdirSync(dir);
    var filelist = false;

    if (files)
      files.forEach((file) => {
        if (
          file.endsWith(".mp3") ||
          file.endsWith(".m4a") ||
          file.endsWith(".webm") ||
          file.endsWith(".wav") ||
          file.endsWith(".aac") ||
          file.endsWith(".ogg") ||
          file.endsWith(".opus")
        ) {
          filelist = true;
        }
      });

    // if (filelist) {
    //   scanDir(dir);
    // } else {
    //   console.log(`Skipped ${dir}, because there was no audio file found`);
    // }
    return filelist;
  }

  function getScanDir(dir) {
    var directories = fs.readdirSync(dir);

    var directory = [dir]; // always add the first directory

    directories.forEach((file, i) => {
      var filename = path.join(dir, file);
      var stat = fs.lstatSync(filename);

      if (stat.isDirectory()) {
        directory = directory.concat(getScanDir(filename));
      }
    });
    return directory;
  }

  storage.clear((err) => {
    if (err) throw err;
  });

  ipcRenderer.on("selectedItem", (event, filePath) => {
    checkIfPathAlreadyIncluded(filePath);
  });

  // checkIfPathAlreadyIncluded("/home/joshwebb/Music/lucidious");

  async function scanDir(filePath) {
    if (!filePath || filePath == "undefined") return;

    watcher = chokidar.watch(filePath, {
      ignored: /[\/\\]\./,
      persistent: true,
    });

    var arr = walkSync(filePath);
    var arg = {};
    var metadata = await parseFiles(arr, filePath);

    arg.files = arr;
    arg.path = filePath;
    arg.metadata = metadata;
    arg.length = metadata.length;

    folder = [...folder, arg];

    folderStore.set(folder);

    startPlayer(folder);

    // AlertMessageStore.set({
    //   msg: "Directory Added.",
    //   path: filePath,
    //   layout: "growl",
    //   effect: "genie",
    //   type: "success",
    // });

    // console.log({
    //   msg: "Directory Added.",
    //   path: filePath,
    // });
  }

  function walkSync(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
      if (
        file.endsWith(".mp3") ||
        file.endsWith(".m4a") ||
        file.endsWith(".webm") ||
        file.endsWith(".wav") ||
        file.endsWith(".aac") ||
        file.endsWith(".ogg") ||
        file.endsWith(".opus")
      ) {
        filelist.push(path.join(dir, file));
      }
    });
    return filelist;
  }

  async function parseFiles(audioFiles, filePath) {
    var titles = [];
    loading = true;

    totalFileLength = [...totalFileLength, audioFiles.length];

    let totalNumber = totalFileLength.reduce((a, b) => a + b, 0);
    totalFileLengthStore.set(totalNumber);

    for (const audioFile of audioFiles) {
      // await will ensure the metadata parsing is completed before we move on to the next file
      const metadata = await mm.parseFile(audioFile, { skipCovers: false });
      const stats = fs.statSync(audioFile);
      var data = {};
      var title = metadata.common.title;
      var artist = metadata.common.artist;
      var album = metadata.common.album;
      var genre = metadata.common.genre;
      var year = metadata.common.year;
      var picture = metadata.common.picture;

      if (title) data.title = metadata.common.title;
      else data.title = path.parse(audioFile).name;

      if (artist) data.artist = metadata.common.artist;
      else data.artist = "Unknown artist";

      if (album) data.album = metadata.common.album;
      else data.album = path.parse(filePath).base;

      if (genre) data.genre = metadata.common.genre;
      else data.genre = "";

      if (year) data.year = metadata.common.year;
      else data.year = "";

      if (picture) {
        data.picture = `data:${
          picture[0].format
        };base64,${picture[0].data.toString("base64")}`;
      } else data.picture = "../public/cover-art/3.png";

      data.modDate = stats.mtime;

      data.duration = metadata.format.duration || 0;

      data.convertDuration = convertDuration(metadata.format.duration);

      data.path = filePath;

      data.file = audioFile;

      data.like = false;

      data.isPlaying = false;

      data.playCount = 0;

      data.id =
        data.duration + data.artist + data.modDate + data.file + data.path;

      titles.push(data);

      progress = (titles.length * 100) / audioFiles.length;
      progressFile = data.title;

      progressStore.set((titles.length * 100) / audioFiles.length);
      progressFileStore.set(data.title);

      if (progress === 100)
        messageStore.set("Finished. " + titles.length + " Files added!");
      else messageStore.set("Examining Files");
    }

    loading = false;

    return titles;
  }

  function startPlayer(songList) {
    var songArr = [];
    songList.forEach((song) => {
      for (let i = 0; i < song.files.length; i++) {
        let {
          title,
          artist,
          album,
          genre,
          like,
          year,
          duration,
          convertDuration,
          isPlaying,
          modDate,
          path,
          file,
          id,
          picture,
        } = song.metadata[i];
        songArr.push({
          path,
          file,
          title,
          artist,
          album,
          genre,
          like,
          year,
          duration,
          convertDuration,
          isPlaying,
          modDate,
          id,
          picture,
        });
      }
    });

    // watcher.on("add", (path) => addSongToPlaylist(path));
    // watcher.on("unlink", (path) => removeSongFromPlaylist(path));

    songArr.sort((a, b) => {
      let titleA = a.title.toLowerCase();
      let titleB = b.title.toLowerCase();

      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
      return 0;
    });

    $playerStore = songArr;
  }
</script>

<div class="app">
  <Search />
  <Modal />
  <main>
    <Tabs />
    <Playlist />
  </main>
  <Control />
</div>
