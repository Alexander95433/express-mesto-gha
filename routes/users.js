const router = require('express').Router();

const {
  getUsers, getUsersById, updateUserProfile, patchUserAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:id', getUsersById);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
