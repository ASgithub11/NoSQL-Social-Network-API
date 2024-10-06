import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';

// Get all users
export const getallUsers = async (_req: Request, res: Response) => {
    try {
        // Retrieve all users
        const users = await User.find({});
        // Send users data as JSON response
        res.json(users);
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    }
};

// Get a single user by ID
export const getOneUser = async (req: Request, res: Response) => {
    try {
        // Find a user by the ID 
        const user = await User.findOne({ _id: req.params.userId }).select('-__v');

        if(!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        // If user is found, send the user data as JSON response
        res.json(user);
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        // Create a new user document from the request body
        const user = await User.create(req.body);
        // Send the newly created user data as JSON response
        res.json(user);
    } catch (err: any) {
        res.status(500).json(err);  // If an error occurs, send a 500 status and the error message
    }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId }, // Find a user by ID
            { $set: req.body },         // Update fields with the request body data
            { runValidators: true, new: true }, // Validate the data and return the new user
        );
        if (!user) {
            return res.status(404).json({message: 'No user found with this id!'});
        }
        // Send a success message as JSON response
        res.json({message: 'User updated successfully!'});
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // Find a user by ID and delete it
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' }); // If no user is found, send a 404 status and message
        }
        await Thought.deleteMany({_id: {$in: user.thoughts}});  // Delete all thoughts associated with the user
        res.json({message: 'User deleted successfully!'});      // Send a success message as JSON response
        return;
    } catch (err: any) {
        res.status(500).json(err);  // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Add a friend to a user's friend list
export const addFriend = async (req: Request, res: Response) => {
    try {
        // Find a user by ID and update the friends list with the new friend
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },             // Find a user by ID
            { $set: { friends: req.body.friends }}, // Set the friends array with new friend IDs
            { runValidators: true, new: true },     // Run validators and return the updated document
        )
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        // Loop through the list of friend IDs and add the current user ID to each friend's friend list
        for (let i = 0; i < req.body.friends.length; i++) {
            const friend = await User.findOneAndUpdate(
                { _id: req.body.friends[i] },               // Find each friend by ID
                { $set: { friends: req.params.userId }},    // Add the current user ID to the friend's friend list
                { runValidators: true, new: true },         // Run validators and return the updated document
            );
            if (!friend) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
        }
        // send a success message as JSON response
        res.json({message: 'Friend added successfully!'});
        return;
    } catch (err: any) {
        res.status(500).json(err);  // If an error occurs, send a 500 status and the error message
        return;
    }
};

// Delete a friend from a user's friend list
export const deleteFriend = async (req: Request, res: Response) => {
    try {
        // Remove the friend ID from the user's friend list
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },                 // Find a user by ID
            { $pull: { friends: req.params.friendId }}, // Remove the friend ID from the friends array
            { new: true },                              // Return the updated document
        );
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        // Remove the current user ID from the friend's friend list
        const friend = await User.findOneAndUpdate(
            { _id: req.params.friendId },               // Find a friend by ID
            { $pull: { friends: req.params.userId }},   // Remove the current user ID from the friend's friend list
            { new: true },                              // Return the updated document
        );
        if (!friend) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        // Send a success message as JSON response
        res.json({message: 'Friend deleted successfully!'});
        return;
    } catch (err: any) {
        res.status(500).json(err); // If an error occurs, send a 500 status and the error message
        return;
    }
};
