const { stdout } = require('process');
const process = require('process');
const path = require('path');
const readline = require('readline');
const fs = require('fs')
const textFilePath = path.join(__dirname, 'text.txt')
const wStrezm = fs.createWriteStream(textFilePath, {flags: 'a'})

const readLine = readline.createInterface({ input: process.stdin, output: process.stdout });
fs.exists(textFilePath, exists => startWriting(exists))

const startWriting = exists => {
  const writeToFile = text => {
    //check is text needed to add '\n' at the end of the string
    if(text != '') {
      exists ? text = '\n' + text : exists = true
    }
    wStrezm.write(text, 'utf-8', (err) => {
      if(err) console.error('Error:',err)
    })
  }
  
  //create file
  writeToFile('')
  
  stdout.write(
    (exists
      ? 'File "text.txt" is modifying...\n'
      : 'File "text.txt" has been created!\n') +
    'Enter your text: \n' +
    '> '
  )
  //stdout.write()
  readLine.on('line', text => {
    if(text.includes('exit')) process.exit();
    writeToFile(text)
    stdout.write('> ')
  })
  
  process.on('exit', () => {console.log('Goodbye, my friend! I\'ll newer forgot you! :(')})
}