const express = require("express");
const helmet = require("helmet");
require("dotenv").config();
const app = express();
const { SECURITY, logger, appVersionMiddleWare, getModulesbyLocation } = require("edu-micro-common");

const resolveCrossDomain = function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);

  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }

};

const setAppVersionToHeader = async function (req, res, next) {
  try {
    let versionNo = await appVersionMiddleWare();
    res.header("Version", versionNo);
    res.header("Server", "");
  } catch (err) {
    logger.error(err);
    res.header("Version", "");
    res.header("Server", "");
  } finally {
    next();
  }
};

const callGetModulesbyLocation = async function (req, res, next) {
  getModulesbyLocation(req);
  next();
};

app.set('view engine', 'ejs');
app.use(helmet());
app.use(resolveCrossDomain, setAppVersionToHeader);

app.use(logger.printLog);

app.use(function applyXFrame(req, res, next) {
  res.set('X-Frame-Options', 'DENY');
  next();
});

console.log('.')
SECURITY(app);
app.use(callGetModulesbyLocation);
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`[SERVER STARTED] Listening to port [${port}]`);
});

module.exports = server;
