import { Router } from 'express';
import { getallUsers, getOneUser, createUser, updateUser, deleteUser, addFriend, deleteFriend } from '../../controllers/userController.js';

const router = Router();

// /api/users
router.route('/').get(getallUsers).post(createUser);

// /api/users/:userId
router
    .route('/:userId')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

// /api/users/:userId/friends
router.route('/:userId/friends').post(addFriend);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(deleteFriend);

export { router as userRouter };
