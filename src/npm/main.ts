'use strict';

import * as path from 'path';


export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

export const getPackageString = (dir: string): string => {

  if(!path.isAbsolute(dir)){
    throw 'path must be absolute.';
  }


  const o = require(dir);

  return JSON.stringify({
    dependencies: o.dependencies,
    devDependencies: o.devDependencies,
    optionalDependencies: o.optionalDependencies,
    peerDependencies: o.peerDependencies
  });


};


