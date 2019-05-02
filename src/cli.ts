#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as main from './main';
import * as crypto from 'crypto';

const shasum = crypto.createHash('sha1');

const str = main.getPackageString(path.resolve(process.cwd() + '/package.json'));
const v = shasum.update(str);
const hex = v.digest('hex');

console.log({hex});

const dir = path.resolve(process.cwd() + '/.packageSHA/npm');

const mkdir = () => {
  try {
    fs.mkdirSync(dir, {recursive: true});
  } catch (err) {
    console.error('Could not create dir here:', dir);
    throw err;
  }
};

process.once('exit', code => {

  if(code < 1){
    return;
  }

  mkdir();
  fs.writeFileSync(dir + '/installed.json', 'false');

});



try{

}
catch(err){

}


const writeToDir = () => {
  fs.writeFileSync(path.resolve(dir + '/previous.json'), str);
  fs.writeFileSync(path.resolve(dir + '/previous.sha'), hex);
  // fs.writeFileSync(path.resolve(dir + '/installed.json'), hex);
};

if (!(fs.existsSync(dir + '/previous.sha') && fs.existsSync(dir + '/previous.json'))) {
  console.error('One or more files was not already present.');
  writeToDir();
  process.exit(1);
}

const previousSHA = fs.readFileSync(dir + '/previous.sha', 'utf8');


if (String(previousSHA).trim() !== String(hex).trim()) {
  console.error('Previous sha does not equal current sha:', previousSHA, '2', String(hex).trim());
  writeToDir();
  process.exit(1);
}

const previousJSON = fs.readFileSync(dir + '/previous.json', 'utf8');

if (String(previousJSON).trim() !== str) {
  console.error('Previous json does not equal current json:', previousJSON, str);
  process.exit(1);
}

if (!process.argv.includes('--no-overwrite')) {
  writeToDir();
}


