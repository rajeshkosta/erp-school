let logger = require("../config/logger"),
  redis = require("redis");

const masterKey = "ERP|";

let baseConnectionURI = process.env.EDU_REDIS_TLS ? "rediss://" : "redis://";

if (process.env.EDU_REDIS_USER && process.env.EDU_REDIS_PASSWORD) {
  baseConnectionURI += `${process.env.EDU_REDIS_USER}:${process.env.EDU_REDIS_PASSWORD}`;
}

let client = redis.createClient({
  url: `${baseConnectionURI}@${process.env.EDU_REDIS_HOST}:${process.env.EDU_REDIS_PORT}`,
});

let clientReader;

if (process.env.EDU_REDIS_HOST_READER) {
  clientReader = redis.createClient({
    url: `${baseConnectionURI}@${process.env.EDU_REDIS_HOST_READER}:${process.env.EDU_REDIS_PORT}`,
  });
} else {
  logger.info(
    "Redis replica host not found. falling back to the primary redis host"
  );
  clientReader = redis.createClient({
    url: `${baseConnectionURI}@${process.env.EDU_REDIS_HOST}:${process.env.EDU_REDIS_PORT}`,
  });
}

let isRedis = false;
let isWriterRedis = false;

clientReader.on("connect", function () {
  logger.info("redis clientReader connected");
  isRedis = true;
});

clientReader.on("error", function (err) {
  logger.error("redis replica connection error " + err);
  throw err;
});

clientReader.on("end", function (err) {
  logger.info("redis replica connection end " + err);
});

client.on("connect", function () {
  logger.info("redis client connected");
  isWriterRedis = true;
});

client.on("error", function (err) {
  logger.error("redis primary connection error " + err);
  throw err;
});

client.on("end", function (err) {
  logger.info("redis primary connection end " + err);
});

function SetRedis(key, val, expiretime) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      let newVal = JSON.stringify(val);
      client.set(key, newVal);
      if (expiretime) {
        client.expire(key, expiretime);
      }

      resolve(redis.print);
    } else {
      reject("err");
    }
  });
}

function GetKeys(key, isScan = false) {
  return new Promise(async (resolve, reject) => {
    key = masterKey + key;
    if (isRedis) {
      if (isScan) {
        clientReader.keys(key, function (err, reply) {
          if (err) {
            reject(err);
          }

          if (reply) {
            resolve(reply);
          } else {
            reject("err");
          }
        });
      } else {
        clientReader.exists(key, function (err, reply) {
          if (err) {
            reject(err);
          }

          if (reply) {
            resolve(key);
          } else {
            resolve(null);
          }
        });
      }
    } else {
      reject("err");
    }
  });
}

function GetRedis(key) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      clientReader.mget(key, function (err, reply) {
        if (err) {
          reject(err);
        }
        if (reply) {
          resolve(reply);
        } else {
          reject("err");
        }
      });
    } else {
      reject("err");
    }
  });
}

function GetKeyRedis(key) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      clientReader.get(key, function (err, reply) {
        if (err) {
          console.log("RedisCheck Err", key, err);
          reject(err);
        }
        if (reply) {
          resolve(reply);
        } else {
          resolve(false);
        }
      });
    } else {
      console.log("RedisCheck Connection closed", key);
      resolve(false);
    }
  });
}

function delRedis(keyPattern) {
  return new Promise(async function (resolve, reject) {
    if (isWriterRedis) {
      let getKeys = await GetKeys(keyPattern);
      if (getKeys && getKeys.length > 0) {
        client.del(getKeys, function (err, reply) {
          if (err) {
            reject(err);
          }
          if (reply) {
            resolve(reply);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}

const deleteKey = async (key) => {
  return new Promise(async (resolve, reject) => {
    key = masterKey + key;
    client.del(key, function (err, reply) {
      if (err) {
        reject(err);
      }
      if (reply) {
        resolve(reply);
      } else {
        resolve();
      }
    });
  });
};

function IncrementRedis(key, expiretime) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      client.INCR(key);
      if (expiretime) {
        client.expire(key, expiretime);
      }
      resolve(redis.print);
    } else {
      reject("err");
    }
  });
}

function decrementRedis(key, value) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      client.DECRBY(key, value);
      resolve(redis.print);
    } else {
      reject("err");
    }
  });
}

function getTTL(key) {
  return new Promise(function (resolve, reject) {
    key = masterKey + key;
    if (isRedis) {
      client.TTL(key, function (err, reply) {
        if (err) {
          reject(err);
        }
        if (reply) {
          resolve(reply);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }
  });
}

module.exports = client;
module.exports.SetRedis = SetRedis;
module.exports.GetKeys = GetKeys;
module.exports.GetRedis = GetRedis;
module.exports.GetKeyRedis = GetKeyRedis;
module.exports.delRedis = delRedis;
module.exports.IncrementRedis = IncrementRedis;
module.exports.decrementRedis = decrementRedis;
module.exports.getTTL = getTTL;
module.exports.deleteKey = deleteKey;
