const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const rStream = fs.createReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'})
const chunks = []

rStream.on('error', err => console.error(`Error: ${err}`))
rStream.on('data', chunk => chunks.push(chunk))
rStream.on('end', () => stdout.write(chunks.join('')+'\n'))