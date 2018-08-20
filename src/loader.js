'use strict';

// import * as formatter from './formatter';
const formatter = require('./formatter');
const fs = require('fs');

// Identity loader
module.exports = function(source) {
// export default function(source) {

  console.log('STARTING LOADER');
  console.log(this.resourcePath);
  console.log(source);
  console.log('DONE LOADING');
  const formattedSource = formatter.formatHtml(source);

  fs.writeFile(this.resourcePath, formattedSource);

  return formattedSource;
};

// module.exports = function(content, map, meta) {
//   var callback = this.async();
//   someAsyncOperation(content, function(err, result) {
//     if (err) {
//       return callback(err);
//     }
//
//     callback(null, result, map, meta);
//   });
// };