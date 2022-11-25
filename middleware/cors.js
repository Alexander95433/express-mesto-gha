// module.exports.corsConfiguration = {
//   origin: [
//     'https://alex-mesto.nomoredomains.icu',
//     'http://alex-mesto.nomoredomains.icu',
//     'http://localhost:3000',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
//   credentials: true,
// };

const allowlist = ['https://alex-mesto.nomoredomains.icu'];
module.exports.corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
