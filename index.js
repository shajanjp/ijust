const git = require("simple-git");
const { config } = require("process");
const HOME_DIR = require("os").homedir();
const fs = require("fs");
const fsp = fs.promises;
let DATA_DIR = "";

(async () => {
  if (process.argv.length == 3) {
    switch (process.argv[2]) {
      case "init": {
        await createDirectory(HOME_DIR + "/.ijust");
        DATA_DIR = HOME_DIR + "/.ijust";
        git(DATA_DIR).init((data) => {
          console.log({ data });
        });
        break;
      }
      case "config": {
        break;
      }
      default: {
        await processActivity(process.argv[2]);
      }
    }
  }
})();

async function createDirectory(path) {
  if (!fs.existsSync(path)) {
    return fsp.mkdir(path, { recursive: true });
  }
}

async function processActivity(activity) {
    
}
