import { Thought, User } from '../models/index.js';
import { Request, Response } from 'express';

// Get all thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        // Retrieve all thoughts
        const thoughts = await Thought.find();
        // Send thoughts data as JSON response
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get a single thought by ID
export const getOneThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        // Find a thought by the ID 
        const thought = await Thought.findById(thoughtId);
        // If thought is found, send the thought data as JSON response
        if(thought) {
            res.json(thought);
        } else {
            res.status(404).json({
                message: 'No thought found with this id!' });
            }
        } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Create a new thought
export const createThought = async (req: Request, res: Response) => {
    try {
        // Create a new thought
        const newthought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },       // Find the user by ID
            { $addToSet: { thoughts: newthought._id }}, // Add the thought to the user's thoughts array
            { runValidators: true, new: true }  // Run validators and return the updated user
        );
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        return res.json(newthought);
    } catch (err) {
        return res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    }
};

// Update a thought by ID
export const updateThoughtById = async (req: Request, res: Response) => {
    try {
        // Update a thought by the ID
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },   // Find the thought by ID
            { $set: req.body },              // Update the thought with the request body
            { new: true }                    // Return the updated thought
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Send a success message as JSON response
        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    }
};

// Delete a thought by thoughtId
export const deleteThought = async (req: Request, res: Response) => {
    try {
        // Delete a thought by the ID
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found!' });
        }
        const user = await User.findOneAndUpdate(
            { _id: thought.userId }, // Find the user by ID
            { $pull: { thoughts: thought._id }}, // Remove the thought from the user's thoughts array
            { runValidators: true, new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        await Thought.findByIdAndDelete(req.params.thoughtId);
        return res.json({ message: 'Thought deleted successfully!' });
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Add a reaction to a thought
export const addReaction = async (req: Request, res: Response) => {
    try {
        // Add a reaction to a thought
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },             // Find the thought by ID
            { $addToSet: { reactions: req.body }},     // Add the reaction to the reactions array
            { runValidators: true, new: true }         // run validators and return the updated thought
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Remove a reaction from a thought by reactionId
export const removeReaction = async (req: Request, res: Response) => {  
    const { reactionId } = req.body;
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },             // Find the thought by ID
            { $pull: { reactions: { reactionId }}}, // Remove the reaction by reactionId
            { runValidators: true, new: true }         // run validators and return the updated thought
        );
        if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json({ message: 'Reaction deleted successfully!', thought });
    } catch (err: any) {
    res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    return;
    }
};

// Get all reactions
export const getAllReactions = async (req: Request, res: Response) => {
    try {
        // Retrieve all reactions
        const thought = await Thought.findById( req.params.thoughtId );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Send reactions data as JSON response
        res.json(thought.reactions);
        return;
    } catch (err) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};
