const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Backend Running ${PORT} [${config.nodeEnv}]`);
});
