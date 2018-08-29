'use strict';

import mongoose, { Schema } from 'mongoose';
// const { Schema } = mongoose;

const noteSchema = Schema({
  title: { type: String, required: true },
  content: { type: String },
  created: { type: Date, required: true },
});

// If Mongoose already has note defined, use it as-is
const Note = mongoose.models.note ||
  // Otherwise, create a new note schema
  mongoose.model('note', noteSchema);

// Export our note constructor
export default Note;
