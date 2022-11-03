const { stdout } = require('process');
const process = require('process');
const path = require('path');
const readline = require('readline');
const fs = require('fs')
const textFilePath = path.join(__dirname, 'text.txt')

const readLine = readline.createInterface({ input: process.stdin, output: process.stdout });

const startWriting = () => {
  let isStarted = true
  const writeToFile = text => {
    //check is text needed to add '\n' at the end of the string
    if(text != '') {
      isStarted ? isStarted = false : text = '\n' + text
    }
    const wStrezm = fs.createWriteStream(textFilePath, {flags: 'a'})
    wStrezm.write(text, 'utf-8', (err) => {
      if(err) console.error('Error:', err)
    })
    wStrezm.close()
  }
  
  //create file
  fs.createWriteStream(textFilePath).write('')
  
  stdout.write(
    'File "text.txt" has been created!\n' +
    'Enter your text: \n' +
    '> '
  );

  //stdout.write()
  readLine.on('line', text => {
    if(text.includes('exit')) process.exit();
    writeToFile(text)
    stdout.write('> ')
  })
  
  process.on('exit', () => {
    stdout.cursorTo(0)
    stdout.write('Goodbye, my friend! I\'ll never forget you! :(\n')
  })
}

startWriting()