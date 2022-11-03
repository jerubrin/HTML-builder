const path = require('path')
const fs = require('fs')

async function buildCss(stylesPath, bundlePath) {
  console.log('Building CSS...')
  const files = await getCssFiles(stylesPath)
  packAllToBundle(bundlePath, files)
}

const getCssFiles = async (dir) => new Promise((resolve, reject) => {
  fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    if(err) return reject(err)
    resolve (
      files
        .filter(file => file.isFile())
        .filter(file => path.extname(file.name) == '.css')
        .map(file => path.join(dir, file.name))
    )
  })
});

const packAllToBundle = async (bundleFile, files) => {
  const wStream = fs.createWriteStream(bundleFile)
  files.forEach(file => writeFile(file, wStream))
}

const writeFile = async (file, wStream) => {
  const rStream = fs.createReadStream(file)
  rStream.pipe(wStream)
}

module.exports = buildCss