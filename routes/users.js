const router = require('express').Router();
const {
  createUsers, getUsers, getUsersById, updateUserProfile, patchUserAvatar, login
} = require('../controllers/users');

router.post('/', createUsers);

router.post('/signin', login);
router.post('/signup', createUsers)

router.get('/', getUsers);

router.get('/:id', getUsersById);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
