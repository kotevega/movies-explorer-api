const userRouter = require('express').Router();
const { getAboutUser, patchUserProfile } = require('../controllers/users');
const { validatePatchUserProfile } = require('../utils/validate');

userRouter.get('/me', getAboutUser);
userRouter.patch('/me', validatePatchUserProfile, patchUserProfile);

module.exports = userRouter;
