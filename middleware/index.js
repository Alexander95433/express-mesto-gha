const defaultUserId = (req, res, next) => {
  req.user = {
    _id: '635a8420b964a6cc96fdcfe4',
  };

  next();
};

module.exports = { defaultUserId };

//const { defaultUserId } = require('./middleware/index');
