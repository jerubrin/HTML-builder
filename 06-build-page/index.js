//Вся основная логика в этих 3-х фалах:
const buildHTML = require('./js-builder/html-builder');
const buildCss = require('./js-builder/css-bundler');
const copyAssets = require('./js-builder/assets-copyier');

const path = require('path');
const fs = require('fs');

const outDir = 'project-dist';
const inHtmlFile = path.join(__dirname, 'template.html');
const outHtmlFile = path.join(__dirname, outDir, 'index.html');
const inCssFolder = path.join(__dirname, 'styles');
const outCssFile = path.join(__dirname, outDir, 'style.css');
const inAssets = path.join(__dirname, 'assets');
const outAssets = path.join(__dirname, outDir, 'assets');

async function buildProject() {
  createDir('project-dist');
  buildHTML(inHtmlFile, outHtmlFile)
  buildCss(inCssFolder, outCssFile)
  copyAssets(inAssets, outAssets)
}

const createDir = (dir) => {
  const dirPath = path.join(__dirname, dir)
  fs.mkdir(dirPath, {recursive: true}, (err) => {if(err) throw err})
}

buildProject()