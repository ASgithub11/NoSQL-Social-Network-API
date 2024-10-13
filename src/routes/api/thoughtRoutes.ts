import { Router } from 'express';
import { getAllThoughts, getOneThoughtById, createThought, updateThoughtById, deleteThought, addReaction, removeReaction, getAllReactions } from '../../controllers/thoughtController.js';

const router = Router();

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId
router
    .route('/:thoughtId')
    .get(getOneThoughtById)
    .put(updateThoughtById)
    .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').get(getAllReactions).post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

// Export the router
export default router;
