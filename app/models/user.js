/**
 * @fileoverview User model.
 */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


/**
 * Schemas
 */

var userSchema = new Schema({
  provider: {type: String, required: true},
  uid:      {type: Number, required: true},
  name:     {type: String, required: true},
  email:    {type: String},
  image:    {type: String},
  admin:    {type: Boolean, default: false}
});


//
mongoose.model('User', userSchema);
