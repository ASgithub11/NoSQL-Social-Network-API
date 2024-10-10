import db from '../config/connection.js';
import cleanDB from './cleanDB.js';
import { users, thoughts } from './data.js';
import { ObjectId } from 'mongoose';
import User, { IUser } from '../models/User.js';
import Thought from '../models/Thought.js';


const seedDB = async () => {
    try {
        // Connect to the database
        await db();
        // Clean the database
        await cleanDB();
        // Add the users to the collection and await the result
        const userData: IUser[] = await User.create(users);
        // Add the thoughts to the collection and await the result
        const thoughtData = await Thought.create(thoughts);
        // Assign friends after creating the users
        const allUsers: (IUser & {_id: ObjectId})[] = await User.find({});
        const userIds: ObjectId[] = allUsers.map(user => user._id);

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];

            // Get a list of all user IDs except the current user
            const friendIds: ObjectId[] = userIds.filter(id => id.toString() !== user._id.toString());

            // Add a random friend to the user's friends list
            const randomFriendId: ObjectId = friendIds[Math.floor(Math.random() * friendIds.length)];

            // Add the random friend to the user's friends list
            user.friends.push(randomFriendId);

            // Save the user with the updated friends list
            await user.save();
        }

        // Log messages to the console
        console.table(userData);
        console.table(thoughtData);
        console.info('Seeding complete! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding the database:', error);
        process.exit(1);
    }
};

// Call the seedDB function
seedDB();
