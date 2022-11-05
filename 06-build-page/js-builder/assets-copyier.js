const fs = require('fs')
const path = require('path')

function copyAssets(inAssets, outAssets) {
  console.log('Copyind assets...')
  copyFolder(inAssets, outAssets)
}

const makeDir = curPath => new Promise((resolve, reject) => {
  fs.mkdir(curPath, {recursive: true}, err => { if(err) reject(err.message) })
  resolve()
})

const rmDir = curPath => new Promise(resolve => {
  fs.rm(curPath, {recursive: true, force: true}, () => resolve())
})

const getFileList = (fromPath, copyPath) => new Promise((resolve, reject) => {
  fs.readdir(fromPath, {withFileTypes: true}, (err, files) => {
    if(err) return reject(err.message)
    files.forEach(dir => {
      if(dir.isDirectory()) copyFolder(path.join(fromPath, dir.name), path.join(copyPath, dir.name))
    })
    let fileLists = files
      .filter(file => file.isFile())
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
  rmDir(copyPath)
    .then(() => makeDir(copyPath))
    .then(() => getFileList(filesPath, copyPath))
    .then(fileLists => 
      fileLists.forEach(file => {
        copyFile(path.join(filesPath, file), copyPath)
      }))
    .catch(err => console.error(err))
}

module.exports = copyAssets