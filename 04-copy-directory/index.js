const path = require('path');
const fs = require('fs');
const { create } = require('domain');
const { resolve } = require('path');
const filesPath = path.join(__dirname, "files")
const copyPath = path.join(__dirname, "files-copy")

const isDirectoryExists = async curPath => new Promise((resolve, reject) => {
  fs.readdir(path.dirname(curPath), {withFileTypes: true}, (err, files) => {
    if(err) return reject(err.message)
    const hasDirectory = files.reduce((c, file) => c || (file.name == path.basename(curPath) && file.isDirectory()) ,false) 
    resolve(hasDirectory)
  })
})

const makeDir = curPath => new Promise((resolve, reject) => {
  fs.mkdir(curPath, err => { if(err) reject(err.message) })
  resolve()
})

const getFileList = fromPath => new Promise((resolve, reject) => {
  fs.readdir(fromPath, {withFileTypes: true}, (err, files) => {
    if(err) return reject(err.message)
    let fileLists = files.filter(file => file.isFile())
      .map(file => file.name);
    resolve(fileLists)
  })
})

const copyFile = (copyFile, toDir) => {
  let fileName = path.basename(copyFile)
  const rStream = fs.createReadStream(copyFile)
  const wStream = fs.createWriteStream(path.join(toDir, fileName))
  rStream.pipe(wStream)
  rStream.on('error', err => console.error(err.message))
}

const copyFolder = (filesPath, copyPath) => {
  isDirectoryExists(copyPath)
  .then(hasDirectory => { if(!hasDirectory) makeDir(copyPath) })
  .then(() => getFileList(filesPath))
  .then(fileLists => 
    fileLists.forEach(file => { 
      copyFile(path.join(filesPath, file), copyPath)
    }))
  .catch(err => console.error(err))
}

//run this
copyFolder(filesPath, copyPath)