import {Schema, model, Document, ObjectId} from 'mongoose';
import Reaction from './Reaction.js';

// Interface to define the structure of a User document
interface IUser extends Document {
    username: string;           // Username of the user
    email: string;              // Email of the user
    thoughts: ObjectId[];       // Array of Thought IDs associated with the user
    friends: ObjectId[];        // Array of User IDs representing the user's friends
    reactions: { type: ObjectId; ref: 'Reaction'}[];    // Array of references to Reaction documents
}

// Schema to create the User model
const userSchema = new Schema<IUser>(
    {
        // Username field with required, unique, and trimmed properties
        username: {
            type: String,   // Data type is String
            required: true, // This field is required
            unique: true,   // Value must be unique across all users
            trim: true,     // Remove leading and trailing whitespace from the input
        },
        // Email field with required, unique, and custom validation properties
        email: {
            type: String,   // Data type is String
            required: true, // This field is required
            unique: true,   // Value must be unique across all users
            maxlength: 50,  // Max allowed length of the email
            validate: {
                // Custom validator to ensure the email is in the valid format
                validator: function(v: string) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props: { value: string }) => `${props.value} is not a valid email address.`,
            },
        },
        // Array of Thought IDs referencing the Thought model
        thoughts: [
            {
                type: Schema.Types.ObjectId,    // Each entry is an ObjectId
                ref: 'Thought',                 // Reference to the Thought model
            },
        ],
        // Array of ObjectIds referencing the User model to represent friends
        friends: [
            {
                type: Schema.Types.ObjectId,    // Each entry is an ObjectId
                ref: 'User',                    // Reference to the User model
            },
        ],
        // Array of ObjectIds referencing the Reaction model to store user reactions
        reactions: [
            {
                type: Schema.Types.ObjectId,    // Each entry is an ObjectId
                ref: 'Reaction',                // Reference to the Reaction model
            },
        ],
    },
    {
        toJSON: {
            virtuals: true, // Include virtuals in JSON output when converting a document to JSON
        },
        id: false,  // Do not include the default `id` field
    }
);

// Create a virtual property `friendCount` that retrieves the length of the user's friends array field on query
userSchema.virtual('friendCount').get(function() {
    return this.friends.length; // Returns the number of friends
});

// Create a virtual property `reactionCount` that retrieves the length of the `reactions` array field on query
userSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;   // Returns the number of reactions
});

// Create the User model using the userSchema
const User = model<IUser>('User', userSchema);

// Export the User model for use in other parts of the application
export default User;
