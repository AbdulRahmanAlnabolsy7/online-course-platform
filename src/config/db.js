const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
module.exports = async (uri) => mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
