const mongoose = require('mongoose');

module.exports = {
  connect() {
    // Checking if the NODE_ENV is on production then set the db to production db else it will set to development
    process.env.NODE_ENV === 'production'
      ? (process.env.DB_URI = process.env.PROD_DB_URI)
      : (process.env.DB_URI = process.env.DEV_DB_URI);
    mongoose.connect(
      process.env.DB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      () => {
        process.env.DB_URI === process.env.DEV_DB_URI
          ? console.log(`Developement db connected!`)
          : console.log(`Production db connected!`);
      }
    );
  },
  mongoose
};
