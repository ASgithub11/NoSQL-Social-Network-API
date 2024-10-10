import { Schema, model, type Document } from 'mongoose';

// Interface to define the structure of a User document
export interface IUser extends Document {
    username: string;           // Username of the user
    email: string;              // Email of the user
    thoughts: Schema.Types.ObjectId[];       // Array of Thought IDs representing the user's thoughts
    friends: Schema.Types.ObjectId[];        // Array of User IDs representing the user's friends
    friendCount?: number;       // Virtual field to show the count of a user's friends
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
    },
    {
        toJSON: {
            virtuals: true, // Include virtuals in JSON output when converting a document to JSON
        },
        timestamps: true,   // Include timestamps in the document
    }
);

// Virtual to calculate the number of friends for a user and return the count
userSchema.virtual('friendCount').get(function (this: IUser) {
    return this.friends.length;
});

// Create the User model using the userSchema
const User = model<IUser>('User', userSchema);

// Export the User model
export default User;
