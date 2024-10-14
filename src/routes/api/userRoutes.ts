import { Router } from 'express';
import { getallUsers, getOneUserById, createUser, updateUserById, deleteUser, addFriend, deleteFriend, getAllFriends } from '../../controllers/userController.js';

const router = Router();

// /api/users
router.route('/').get(getallUsers).post(createUser);

// /api/users/:userId
router
    .route('/:userId')
    .get(getOneUserById)
    .put(updateUserById)
    .delete(deleteUser);

// /api/users/:userId/friends
router.route('/:userId/friends').get(getAllFriends);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

// Export the router
export default router;
