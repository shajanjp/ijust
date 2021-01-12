const git = require("simple-git");
const { config } = require("process");
const HOME_DIR = require("os").homedir();
const fs = require("fs");
const fsp = fs.promises;
const DATA_DIR = HOME_DIR + "/.ijust";
let repoGit;

(async () => {
  await initGit();

  if (process.argv.length > 2) {
    switch (process.argv[2]) {
      case "init": {
        await initGit();

        break;
      }

      case "config": {
        console.log(process.argv);
        if (
          process.argv.length > 5 &&
          process.argv[3] === "remote" &&
          process.argv[4] === "add" &&
          !(await repoGit.getRemotes()).map((r) => r.name).includes("origin")
        ) {
          await repoGit.addRemote("origin", process.argv[5]);
        }

        break;
      }

      default: {
        await processActivity(process.argv[2]);
      }
    }
  }
})();

async function initGit() {
  await createDirectory(DATA_DIR);

  repoGit = git(DATA_DIR).init();
}

async function createDirectory(path) {
  if (!fs.existsSync(path)) {
    return fsp.mkdir(path, { recursive: true });
  }
}

async function pushDataToFile(fileName, activityData) {
  const filePath = `${DATA_DIR}/${fileName}`;

  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (!err) {
        const fileData = JSON.parse(await fsp.readFile(filePath, "utf8"));

        fileData.push(activityData);
        await fsp.writeFile(filePath, JSON.stringify(fileData, null, 2), "utf8");
      } else {
        await createDirectory(DATA_DIR);
        await fsp.writeFile(filePath, JSON.stringify([activityData], null, 2), "utf8");
      }
      resolve();
    });
  });
}

async function processActivity(activity) {
  const now = new Date();
  const fileName = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${now.getDate()}.json`;
  
  await pushDataToFile(`${fileName}`, {
    activity,
    timespamp: new Date(),
  });
  try {
    await repoGit
      .add([`${DATA_DIR}/${fileName}`])
      .commit(`activity: ${activity}`)
      .push(["-u", "origin", "master"], () => {});
  } catch (error) {}
}
