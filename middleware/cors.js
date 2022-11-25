module.exports.corsConfiguration = {
  origin: [
    'https://alex-mesto.nomoredomains.icu',
    'http://alex-mesto.nomoredomains.icu',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
};
