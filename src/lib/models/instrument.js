'use strict';

import mongoose, { Schema } from 'mongoose';

const instrumentSchema = Schema({
  name: { type: String, required: true},
  family: { type: String, required: true},
  retailer: { type: String},
});

const Instrument = mongoose.models.instrument || mongoose.model('instrument', instrumentSchema);

export default Instrument;