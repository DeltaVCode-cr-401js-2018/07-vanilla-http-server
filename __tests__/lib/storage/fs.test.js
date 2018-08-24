'use strict';

const uuid = require('uuid/v4');
const Storage = require('../../../src/lib/storage/fs');

describe('FileStorage', () => {
  it('rejects saving non-object', () => {
    var store = new Storage('test');

    return expect(store.save('oops'))
      .rejects.toThrow('schema "test"');
  });

  it('can save an object', () => {
    var store = new Storage('test');

    return store.save({ name: 'Keith' })
      .then(saved => {
        // We don't know what new id should be!
        // expect(saved).toEqual({ name: 'Keith' });
        expect(saved).toBeDefined();
        expect(saved.id).toBeDefined();
        expect(saved.name).toBe('Keith');

        return store.get(saved.id)
          .then(fromStore => {
            expect(fromStore).toEqual(saved);
          });
      });
  });

  it('rejects if get is provided a missing id', () => {
    var store = new Storage('test');

    return expect(store.get('missing'))
      .rejects.toThrow('Document with id "missing" in schema "test" not found');
  });

  it('resolves with empty array for getAll on empty store', () => {
    // 1. Arrange
    var store = new Storage('fs-storage-test-' + uuid());

    // 2. Act
    return store.getAll()
      .then(results => {
        // 3. Assert
        expect(results).toEqual([]);
      });
  });

  it('resolves with expected array for getAll on non-empty store', () => {
    // 1. Arrange test data, thing to test, etc
    var store = new Storage('fs-storage-test-' + uuid());

    var toSave = [
      { name: 'Keith' },
      { class: 'DeltaV' },
    ];

    return Promise.all(
      toSave.map(obj => store.save(obj))
    ).then(saved => {

      // 2. Act on the thing to test, e.g. call the method
      return store.getAll()
        .then(results => {

          // 3. Assert (expect) what you think should happen
          expect(results.length).toBe(saved.length);

          // If lengths match and each is contained, we're good
          saved.forEach(savedDoc => {
            expect(results).toContainEqual(savedDoc);
          });
        });
    });
  });
});
