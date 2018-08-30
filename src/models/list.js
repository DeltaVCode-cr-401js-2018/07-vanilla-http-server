'use strict';

import mongoose, { Schema } from 'mongoose';

const listSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  notes: [
    { type: Schema.Types.ObjectId, ref: 'note' },
  ],
});

const List = mongoose.model('list', listSchema);

// For models middleware
// to support /api/lists instead of /api/list
List.route = 'lists';

export default List;
