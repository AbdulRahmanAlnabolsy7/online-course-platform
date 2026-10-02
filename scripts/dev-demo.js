// Local demo only: starts an isolated temporary MongoDB and the real API server.
process.env.MONGOMS_DOWNLOAD_DIR = require('path').resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');
async function main() {
  const mongo = await MongoMemoryServer.create();
  const child = spawn(process.execPath, ['src/server.js'], {
    stdio: 'inherit', env: { ...process.env, MONGO_URI: mongo.getUri(), NODE_ENV: 'development' }
  });
  console.log('Temporary demo database: data disappears when this process stops.');
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    child.kill('SIGTERM');
    await mongo.stop();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  child.on('exit', async code => { await stop(); process.exitCode = code || 0; });
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });
