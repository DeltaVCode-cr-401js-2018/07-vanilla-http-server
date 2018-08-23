'use strict';

const os = require('os');
const fs = require('fs');
const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);
const uuid = require('uuid/v4');

class FilesystemStorage {
  constructor(schema) {
    this.schema = schema;

    // Ensure schema data dir exists
    this.path = `${os.tmpdir}/${this.schema}`;
    try {
      fs.mkdirSync(this.path);
    } catch (err) {
      if (err.code !== 'EEXIST')
        throw err;
    }
  }

  save(document) {
    if (typeof document !== 'object') {
      return Promise.reject(new Error(
        `Failed to save non-object in schema "${this.schema}"`
      ));
    }

    document.id = uuid();
    let path = `${this.path}/${document.id}.json`;
    return writeFilePromise(
      path,
      JSON.stringify(document)
    ).then(() => {
      return document;
    });
  }

  get(id) {
    let path = `${this.path}/${id}.json`;
    return readFilePromise(path)
      .then(data => {
        return JSON.parse(data);
      })
      .catch(err => {
        if (err.code === 'ENOENT')
          return Promise.reject(new Error(
            `Document with id "${id}" in schema "${this.schema}" not found`
          ));
        return Promise.reject(err);
      });
  }
}

module.exports = FilesystemStorage;

// Usage: promisify(fs.readFile)
// readFilePromise(path).then(...)
function promisify (asyncFunction) {
  return (...args) =>
    new Promise((resolve, reject) => {
      asyncFunction(...args, (err, result) => {
        if (err) { reject(err); }
        else { resolve(result); }
      });
    });
}
