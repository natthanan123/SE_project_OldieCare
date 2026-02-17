module.exports = {
  elderly: { expiresIn: '30d', expiresInSeconds: 30*24*60*60, idleTimeout: null },
  relative:{ expiresIn: '30d', expiresInSeconds: 30*24*60*60, idleTimeout: null },
  nurse:   { expiresIn: '12h', expiresInSeconds: 12*60*60, idleTimeout: 2*60*60 },
  admin: { expiresIn: '1h', expiresInSeconds: 3600, idleTimeout: 900}
};
