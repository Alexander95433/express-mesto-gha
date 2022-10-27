const defaultUserId = (req, res, next) => {
  req.user = {
    _id: '635645d23cafd9c17b6b170e',
  };

  next();
};

module.exports = { defaultUserId };
