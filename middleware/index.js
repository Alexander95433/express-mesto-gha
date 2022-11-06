const defaultUserId = (req, res, next) => {
  req.user = {
    _id: '6366f959ee730e4c89ca6757',
  };

  next();
};

module.exports = { defaultUserId };
