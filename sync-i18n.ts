//import fs from 'fs';
const fs = require('fs');

function sync({ folderName, primary }) {
  const folders = getDirectories(folderName);
}

function getDirectories(folderName) {
  if (checkIfDirectoryExists(folderName)) {
    const paths = fs.readdirSync(folderName);
    console.log(paths);
  }

  return [];
}

function checkIfDirectoryExists(folderName) {
  if (!fs.existsSync(folderName)) {
    return false;
  }
  return true;
}

function getDirectoryFolder() {}

function getDirectoryFiles() {}

function readFile(fileName) {
  const data = fs.readFileSync(fileName, 'utf8');
  const json = JSON.parse(data);
  console.log(new Map(Object.entries(json)));
}

sync({ folderName: './i18n/locales' });
