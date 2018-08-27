'use strict';

import Storage from '../lib/storage';
const noteStore = new Storage('notes');

export default class Note {
  constructor(obj) {
    if (!obj) throw new Error('obj is required!');

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
