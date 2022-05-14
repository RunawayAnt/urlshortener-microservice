require('dotenv').config();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { Schema } = mongoose;

// Configuration Mongo

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

autoIncrement.initialize(mongoose.connection);

const urlSchema = new Schema({
  original_url: { type: String, required: true },
});

urlSchema.plugin(autoIncrement.plugin, { model: 'URL', field: 'short_url', startAt: 1 });

const URL = mongoose.model('URL', urlSchema);

//Actions MongoDB


// 'https://www.google.com'
const findAndCreateURL = (newURL, done) => {

  URL.findOne({ original_url: newURL }, (err, data) => {
    if (err) {
      done(err);
      return;
    }
    if (!data) {
      let uri = new URL({
        original_url: newURL
      });

      uri.save((err, data) => {
        if (err) {
          done(err);
          return;
        }
        done(null, data);
      });
    } else {
      done(null, data);
    }
  });

}

const findURL = (id, done) => {
  URL.findOne({short_url: id}, (err, data) =>{
    if(err) {
      done(err);
      return;
    }
    done(null, data);
  });
}

//--Modules exports
exports.URLModel = URL;
exports.findAndCreateURL = findAndCreateURL;
exports.findURL = findURL;