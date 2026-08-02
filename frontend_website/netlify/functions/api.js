const serverless = require("serverless-http");
const app = require("./api/backend/app");

const PREFIX = "/.netlify/functions/api";

exports.handler = serverless(app, {
  request(req) {
    if (req.url && req.url.startsWith(PREFIX)) {
      req.url = req.url.slice(PREFIX.length) || "/";
    }
  },
});
