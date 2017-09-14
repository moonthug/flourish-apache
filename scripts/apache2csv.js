///////////////////////////////////////
//
// DEPENDENCIES

const fs = require('fs');
const path = require('path');


///////////////////////////////////////
//
// HELPERS

/**
 *
 * @param {string} webPath
 * @returns {string}
 */
let getPathType = (webPath) => {
  let ext = path.extname(webPath.split('?')[0]).toLowerCase();

  let type = '';

  switch(ext) {
    case '.gif':
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.ico':
      type = 'image';
      break;

    case '.txt':
      type = 'text';
      break;

    case '.html':
    case '.htm':
    case '.cgi':
    case '.asp':
    case '':
      type = 'document';
      break;

    default:
      type = 'unknown';
      break;
  }

  return type;
};

/**
 *
 * @param {string} date
 * @returns {number}
 */
let getDateToUnix = (date) => {
  return new Date(
    date
      .replace(/\[|]/g, '')
      .replace(/:/, ' ')
      .replace(/\//g, ' ')
  ).getTime() / 1000;
};


///////////////////////////////////////
//
// MAIN

let rawData = fs.readFileSync('../data/access_log').toString('utf8');

let data = rawData
  .split('\n')
  .filter(row => {
    // Ignore rows that dont have all data (i.e. HTTP 408)
    return !(row.split(' ').length < 10)
  })
  .map(row => {
    let cols = row.split(' ');

    return [
      cols[0],                      // IP
      getDateToUnix(cols[3]),       // Date
      cols[5].replace('"', ''),     // Verb
      cols[6],                      // Path
      getPathType(cols[6]),         // Type
      cols[8]                       // HTTP Response Code
    ].join(',')
  });

let csvData = ['Host,Date,Verb,Path,Type,HTTP Response', ...data];

fs.writeFileSync('../data/access_log.csv', csvData.join('\n'));