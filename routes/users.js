const router = require('express').Router();
const {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar,
} = require('../controllers/users');

router.post('/', createUsers);

router.get('/', getUsers);

router.get('/:id', getUsersById);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
