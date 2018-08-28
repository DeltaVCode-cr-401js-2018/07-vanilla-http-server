'use strict';

const debug = require('debug')('models/note');

import Storage from '../lib/storage';
const noteStore = new Storage('notes');

export default class Note {
  constructor(obj) {
    if (!obj) throw new Error('obj is required!');
    debug('new Note', obj);

    this.title = obj.title;
    this.content = obj.content;
  }

  save() {
    debug('save', this);
    return noteStore.save(this);
  }

  static fetchAll() {
    return noteStore.getAll().then(data => {
      debug('fetchAll', data);
      return data;
    });
  }

  static findById(id) {
    return noteStore.get(id);
  }
}
