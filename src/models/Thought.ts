import { Schema, model, Document } from 'mongoose';
import Reaction from './Reaction.js';

// Interface to define the structure of a Thought document
interface IThought extends Document {
    thoughtText: string;        // Text content of the thought
    createdAt: Date;            // Date the thought was created
    username: string;           // Username of the user who created the thought
    reactions: { type: Schema.Types.ObjectId; ref: 'Reaction' }[]; // Array of references to Reaction documents
}

// Schema to create the Thought model
const thoughtSchema = new Schema<IThought>(
    {
        // Thought text field properties
        thoughtText: {
            type: String,       // Data type is String
            required: true,     // This field is required
            minlength: 1,       // Minimum length of the thought text
            maxlength: 280,     // Maximum length of the thought text
        },
        // createdAt field to store the date the thought was created
        createdAt: {
            type: Date,         // Data type is Date
            default: Date.now,  // Default value is the current timestamp when a thought is created
        },
        // Username field to store the username of the user who created the thought
        username: {
            type: String,       // Data type is String
            required: true,     // This field is required
        },
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
            virtuals: true,     // Include virtual properties when data is serialized
            getters: true,      // Apply getters when data is serialized
        },
        id: false,              // Disable virtual "id" property
    }
);

// Create a virtual property `reactionCount` that retrieves the length of the `reactions` array field on query
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length; // Returns the total count of reactions on this thought
});

// Create the Thought model using the thoughtSchema
const Thought = model<IThought>('Thought', thoughtSchema);

// Export the Thought model
export default Thought;
