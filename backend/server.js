const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Concer TIX Backend API running on port ${PORT} [${config.nodeEnv}]`);
});
