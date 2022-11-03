const path = require('path');
const fs = require('fs');
const folder = 'secret-folder'
const fullPath = path.join(__dirname, folder)

async function readdir(fullPath, options) {
  return new Promise((res, rej) => fs.readdir(fullPath, options, (err, files) => {
    if(err) {
      return rej(err.message);
    }
    res([files, fullPath])
  }))
}

async function getFileInfo(fullPath, file) {
  return new Promise((res, rej) => fs.stat(path.join(fullPath, file.name), (err, data) => {
    if(err) return rej(err.message)
    res([data, file.name])
  }))
}

function logFileInfo(file, fileName) {
  console.log(
    (path.parse(fileName).name) + ' - ' +
    (path.extname(fileName).substring(1)) + ' - ' +
    file.size
  )
}

readdir(fullPath, {withFileTypes: true})
  .then(([files, fullPath]) => {
    files
      .filter(file => file.isFile())
      .sort()
      .forEach(file => {
        getFileInfo(fullPath, file)
          .then(([data, fileName]) => logFileInfo(data, fileName))
          .catch(err => console.error(err))
      })
  })
  .catch(err => console.error(err))


//Without Promises

// fs.readdir(fullPath, {withFileTypes: true}, (err, files) => {
//   if(err) {
//     console.error(err);
//   } else {
//     files.filter(file => file.isFile())
//       .forEach(file => {
//         fs.stat(path.join(fullPath, file.name), (err, res) => {
//           console.log(
//             path.parse(file.name).name + ' - ' +
//             path.extname(file.name).substring(1) + ' - ' +
//             (res.size > 1024 ? bytesToKbytes(res.size) : res.size)
//           )
//         })
//       })
//   }
// })