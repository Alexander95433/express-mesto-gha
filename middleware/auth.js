const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/BadAuthError');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return new BadAuthError('Необходима авторизация');
  // }
  // const token = authorization.replace('Bearer ', '');

  const token = req.cookies.jwt;
  let payload;
  try { payload = jwt.verify(token, 'some-secret-key'); } catch (err) {
    return next(new BadAuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
