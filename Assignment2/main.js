const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
const EventEmitter = require("events");
const os = require("os");
const zlib = require("zlib");
const { pipeline } = require("stream");
const event = new EventEmitter();

// Q1
function fileDirPath() {
  const folderPath = __dirname;
  const filePath = __filename;

  console.log(folderPath);
  console.log(filePath);
}
// fileDirPath();

//Q2
const filePath = __filename;
function fileName(filePath) {
  return path.parse(filePath).base;
}
// console.log(fileName(filePath));

//Q3
function PathBuilder() {
  return path.normalize(
    path.format({
      root: "/",
      dir: "/folder",
      name: "app",
      ext: ".js",
    }),
  );
}
// console.log(PathBuilder());

//Q4
function fileExt(filePath) {
  return path.parse(filePath).ext;
}
// console.log(fileExt(filePath));

//Q5
function fileNameExt(filePath) {
  const fileParse = path.parse(filePath);
  return {
    Name: fileParse.name,
    Ext: fileParse.ext,
  };
}
// console.log(fileNameExt(filePath));

//Q6
function isAbsolute(filePath) {
  return path.isAbsolute(filePath);
}
// console.log(isAbsolute(filePath));

//Q7
function joinSegments() {
  return path.join("src", "components", "App.js");
}
// console.log(joinSegments());

//Q8
const relativePath = "main.js";
function absolutePath(relativePath) {
  return path.resolve(relativePath);
}
// console.log(absolutePath(relativePath));

//Q9
const path1 = "/folder1";
const path2 = "folder2/file.txt";
function joinPaths(...paths) {
  // lsbb ma (path.normalize) msh 3ayz esht8l hna
  return path.join(...paths);
}
// console.log(path.normalize(joinPaths(path1, path2)));

//Q10
const deleteFilePath = "../txtFile/file.txt";
async function deleteFileAsync(filePath) {
  try {
    await fs.rm(filePath);
    console.log(`${filePath} Deleted`);
  } catch (err) {
    console.log("file has been deleted or not found");
  }
}
// deleteFileAsync(deleteFilePath);

//Q11
function createFileSync() {
  try {
    fs.mkdirSync("./ahmedftxt");
    console.log("Success");
  } catch (err) {
    console.log(err);
  }
}
// createFileSync();

//Q12
event.on("welcome", () => {
  console.log("Welcome event triggered!");
});
// event.emit("welcome");

//Q13
event.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});

// event.emit("login", "Ahmed");

//Q14
const readPath = "../txtFile/file.txt";
async function readFileSync(filePath) {
  const content = fsSync.readFileSync(filePath, "utf-8");
  console.log(`the file content =>  ${content}`);
}
// readFileSync(readPath);

//Q15
const writePath = "../txtFile/file.txt";
async function writeFileAsync(writePath) {
  await fs.writeFile(writePath, "Async Save\n", {
    encoding: "utf-8",
    flag: "a",
  });
}
// writeFileAsync(writePath);

//Q16
function isExist(dirPath) {
  return fsSync.existsSync(dirPath);
}
// console.log(isExist("C:\\Users\\ahmad\\Desktop\\Route\\Assigment2"));

//Q17
function OS() {
  return {
    Platform: os.platform(),
    CPUArch: os.arch(),
  };
}
// console.log(OS());

//Q18
const chunkFile = "../txtFile/big.txt";
function printchunks() {
  let result = "";
  let readingStream = fsSync.createReadStream(chunkFile, {
    encoding: "utf-8",
  });
  readingStream.on("data", (data) => {
    result += data;
    console.log(data);
  });
}
// printchunks();

//Q19
const readfile = "../txtFile/source.txt";
const writefile = "../txtFile/dest.txt";
function readWriteStream() {
  const readStream = fsSync.createReadStream(readfile);
  const writeStream = fsSync.createWriteStream(writefile);

  readStream.pipe(writeStream);
}
// readWriteStream();

//Q20
const readStream = fsSync.createReadStream("./txtFile/data.txt");
const writeStream = fsSync.createWriteStream("./txtFile/data.txt.gz");
const gzip = zlib.createGzip();
function compressing() {
  pipeline(readStream, gzip, writeStream, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Completed");
    }
  });
}
// compressing();
