import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';

// Get all users
export const getallUsers = async (_req: Request, res: Response) => {
    try {
        // Retrieve all users
        const users = await User.find();
        // Send users data as JSON response
        res.json(users);
    } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Get a single user by ID
export const getOneUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Find a user by the ID 
        const user = await User.findById(userId);
        // If user is found, send the user data as JSON response
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({
                message: 'No user found with this id!' 
            });
        }
    } catch (error: any) {
            res.status(500).json({
                message: error.message   // If an error occurs, send a 500 status and the error message
            });
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    const { username, email } = req.body;
    try {
        // Create a new user document from the request body
        const newUser = await User.create({ username, email });
        // Send the newly created user data as JSON response
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId }, // Find a user by ID
            { $set: req.body },         // Update fields with the request body data
            { new: true },              // Return the new user
        );
        if (!user) {
            return res.status(404).json({message: 'No user found with this id!'});
        }
        // Send a success message as JSON response
        return res.json(user)
    } catch (err) {
        return res.status(500).json(err); // If an error occurs, send a 500 status and the error message
    }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // Find a user by ID and delete it
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' }); // If no user is found, send a 404 status and message
        } else {
            await Thought.deleteMany({_id: {$in: user.thoughts}});  // Delete all thoughts associated with the user
            res.json({message: 'User and associated thoughts deleted successfully!'});      // Send a success message as JSON response
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Add a friend to a user's friend list
export const addFriend = async (req: Request, res: Response) => {
    const {userId, friendId} = req.params;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },                        // Find a user by ID
            { $addToSet: { friends: friendId }},    // Add the friend ID to the user's friend list
            { new: true },                          // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        console.log(`Friend added to user's friend list: ${updatedUser}`);
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error('Error adding friend to user:', error);
        return res.status(500).json({
            message: 'Error adding friend', error: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Delete a friend from a user's friend list
export const deleteFriend = async (req: Request, res: Response) => {
    const {userId, friendId} = req.params;
    try {
        // Remove the friend ID from the user's friend list
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },                 // Find a user by ID
            { $pull: { friends: friendId }}, // Remove the friend ID from the user's friend list
            { new: true },                   // Return the updated document
        );
        if (!updateUserById) {
            res.status(404).json({ message: 'No user found with this id!' });
        } else {
            res.json(updatedUser);
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};

// Get all friends
export const getAllFriends = async (req: Request, res: Response) => {
    try {
        const friends = await User.findOne({ id: req.params.id }, 'friends' );
        if (!friends) {
            res.status(404).json({ message: 'No friends found with this id!' });
        } else {
            res.json(friends);
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message   // If an error occurs, send a 500 status and the error message
        });
    }
};
