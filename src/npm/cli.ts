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
const dir = path.resolve(process.cwd() + '/.package.sha/npm');
const argv = process.argv.slice(2);

const mkdir = () => {
  try {
    fs.mkdirSync(dir, {recursive: true});
  } catch (err) {
    console.error('Could not create dir here:', dir);
    throw err;
  }
};


mkdir();


process.once('exit', code => {

  if (code < 1) {
    console.log('Success. Next version appears to have same dependencies as previous version.');
    return;
  }

  console.log('Looks like next version has different dependencies than previous version. Re-install recommended.');

  if (fs.existsSync(dir)) {
    fs.writeFileSync(dir + '/installed.json', 'false');
  }

});


const writeToDir = () => {

  if (argv.includes('--no-overwrite')) {
    return;
  }

  fs.writeFileSync(path.resolve(dir + '/previous.json'), str);
  fs.writeFileSync(path.resolve(dir + '/previous.sha'), hex);
  // fs.writeFileSync(path.resolve(dir + '/installed.json'), hex);
};

{
  const file = path.resolve(dir + '/previous.json');
  if (!(fs.existsSync(dir + '/previous.json'))) {
    console.error('The following file was not present so we exit with 1,', file);
    writeToDir();
    process.exit(1);
  }
}


{
  const file = path.resolve(dir + '/previous.sha');
  if (!(fs.existsSync(file))) {
    console.error('The following file was not present so we exit with 1,', file);
    writeToDir();
    process.exit(1);
  }
}


const previousSHA = fs.readFileSync(dir + '/previous.sha', 'utf8');

if (String(previousSHA).trim() !== String(hex).trim()) {
  console.error('Previous sha does not equal current sha:', previousSHA, String(hex).trim());
  writeToDir();
  process.exit(1);
}

const previousJSON = fs.readFileSync(dir + '/previous.json', 'utf8');

if (String(previousJSON).trim() !== str) {
  console.error('(Note that it is strange/unexpected for the shas to be the same but the JSON to differ.)')
  console.error('Previous json does not equal current json:', previousJSON, str);
  writeToDir();
  process.exit(1);
}


writeToDir();
process.exit(0);



