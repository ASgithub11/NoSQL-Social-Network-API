import { Thought, User } from '../models/index.js';
import { Request, Response } from 'express';

// Get all thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        // Retrieve all thoughts
        const thoughts = await Thought.find();
        // Send thoughts data as JSON response
        res.json(thoughts);
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    }
};

// Get a single thought by ID
export const getOneThought = async (req: Request, res: Response) => {
    try {
        // Find a thought by the ID 
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if(!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // If thought is found, send the thought data as JSON response
        res.json(thought);
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Create a new thought
export const createThought = async (req: Request, res: Response) => {
    try {
        // Create a new thought
        const thought = await Thought.create(req.body);
        const user = await Thought.findOneAndUpdate(
            { username: req.body.username },            // Find the user by the username
            { $addToSet: { thoughts: thought._id }},    // Add the thought to the user's thoughts array
            { new: true }                               // Return the updated user data
        );
        if (!user) {
            return res.status(404).json({ message: 'Thought created, but no user found with this username!' });
        }
        // Send a success message as JSON response
        res.json('Thought created successfully!');
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Update a thought by ID
export const updateThought = async (req: Request, res: Response) => {
    try {
        // Update a thought by the ID
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },   // Find the thought by ID
            { $set: req.body },              // Update the thought with the request body
            { runValidators: true, new: true } // run validators and return the updated thought
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        // Send a success message as JSON response
        res.json('Thought updated successfully!');
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Delete a thought by ID
export const deleteThought = async (req: Request, res: Response) => {
    try {
        // Delete a thought by the ID
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        //
        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },           // Find the user with the thought to remove
            { $pull: { thoughts: req.params.thoughtId }}, // Remove the thought from the user's thoughts array
            { new: true }                                 // Return the updated user data
        );
        if (!user) {
            return res.status(404).json({ message: 'Thought deleted! But no user found with this id!' });
        }
        // Send a success message as JSON response
        res.json('Thought deleted successfully!');
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
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
        //
        const user = await User.findOneAndUpdate(
            { username: req.body.username },            // Find the user by the username
            { $addToSet: { reactions: req.body }},      // Add the reaction to the user's reactions array
            { runValidators: true, new: true }         // 
        );
        if (!user) {
            return res.status(404).json({ message: 'Reaction added! But no user found with this id!' });
        }

        res.json(thought);
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Remove a reaction from a thought
export const removeReaction = async (req: Request, res: Response) => {
    let thought;
    try {
        thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },             // Find the thought by ID
            { $pull: { reactions: { reactionId: req.params.reactionId }}}, // Remove the reaction by reactionId
            { runValidators: true, new: true }         // run validators and return the updated thought
        );
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
    if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
    }
    //
    res.json({ message: 'Reaction removed successfully!' });
    return;
};
