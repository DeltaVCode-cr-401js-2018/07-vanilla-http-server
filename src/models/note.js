'use strict';

import mongoose, { Schema } from 'mongoose';
// const { Schema } = mongoose;

const noteSchema = Schema({
  title: { type: String, required: true },
  content: { type: String },
  created: { type: Date, required: true, default: Date.now },
  completed: { type: Boolean, required: true, default: false },
  list: { type: Schema.Types.ObjectId, ref: 'list' },
});

// If Mongoose already has note defined, use it as-is
const Note = mongoose.models.note ||
  // Otherwise, create a new note schema
  mongoose.model('note', noteSchema);

// For models middleware
Note.route = 'notes';

// Export our note constructor
export default Note;
