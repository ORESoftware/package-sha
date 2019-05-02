'use strict';

/*
    from this  '--foo a' , will return "a"
 */
export const getSingleValue = (argv: Array<string>, v : string): string => {

  const index = argv.indexOf(v);

  if(index < 0){
    return null;
  }

  return argv[+1];
};

/*
    from this '--foo a --foo b', will return [a,b]
 */
export const getMultipleValues = (argv: Array<string>, a : string): Array<string> => {
  return argv.filter(v => (v.toUpperCase() === a.toUpperCase())).map((v,i) => argv[i+1]);
};
