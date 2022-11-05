const path = require('path')
const fs = require('fs')
const readline = require('readline');

const linesArr = []
let compCounter = 0

async function buildHTML(inFile, outFile) {
  console.log('Creating HTML...')
  const componentsDir = path.join(path.dirname(inFile), 'components')
  const wStream = fs.createWriteStream(outFile, {encoding: 'utf-8'});
  const rl = readline.createInterface({
    input: fs.createReadStream(inFile, {encoding: 'utf-8'}),
    crlfDelay: Infinity
  });

  rl.on('line', input => {
    if(input.search('{{') > 0 && input.search('}}') > input.search('{{')) {
      const _arr = input.split('{')
      const _before = _arr[0] //spaces before block
        .split('')
        .filter(ch => ch == ' ')
        .join('')
      const _componentNames = _arr
        .filter((it, i, arr) => arr[i - 1] == '')
        .map(it => it.split('}')[0])
      _componentNames.forEach(comp => linesArr.push(`${_before}{{${comp}}}`))
    } else {
      linesArr.push(input)
    }
  })
  rl.on('close', () => fillArr(componentsDir, wStream))
}

const fillArr = (componentsDir, wStream) => {
  linesArr.forEach((input, i) => {
    if(input.search('{{') > 0 && input.search('}}') > input.search('{{')) {
      compCounter++
      const _arr = input.split('{')
      const _before = _arr[0] //spaces before block
        .split('')
        .filter(ch => ch == ' ')
        .join('')
      const _componentName = _arr[2].split('}')[0]
      const componentPath = path.join(componentsDir, _componentName+'.html')
      addComponent(componentPath, _before)
        .then(it => linesArr[i] = it)
        .then(it => {
          if(compCounter == 0) linesArr.flat().forEach(it => wStream.write(it+'\n'))
        })
    }
  });
}

const addComponent = (componentPath, before) => new Promise((res, rej) => {
  const outComponent = []
  const rl = readline.createInterface({
    input: fs.createReadStream(componentPath, {encoding: 'utf-8'}),
    crlfDelay: Infinity
  })
  rl.on('line', input => {
    outComponent.push(before + input)
  })
  rl.on('close', () => {
    compCounter--;
    res(outComponent)
  })
  rl.on('error', err => rej(err))
})

module.exports = buildHTML