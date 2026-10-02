const env = require('./config/env');
const connect = require('./config/db');
const mongoose = require('mongoose');
const app = require('./app');
let server;
async function start() {
  await connect(env.MONGO_URI);
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
  server = app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}; documentation: /api-docs`));
}
async function shutdown() {
  const timer = setTimeout(() => process.exit(1), 10000).unref();
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  clearTimeout(timer);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
start().catch(err => { console.error(err.message); process.exitCode = 1; });
