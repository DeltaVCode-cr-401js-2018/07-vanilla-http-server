'use strict';

const Storage = require('../lib/storage');
const noteStore = new Storage('notes');

class Note {
  constructor(obj) {
    this.title = obj.title;
    this.content = obj.content;
  }

  save() {
    return noteStore.save(this);
  }

  static fetchAll() {
    return noteStore.getAll();
  }

  static findById(id) {
    return noteStore.get(id);
  }
}

module.exports = Note;
