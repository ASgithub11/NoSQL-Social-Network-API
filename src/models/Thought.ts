import { Schema, model, Types, type Document } from 'mongoose';
import reactionSchema from './Reaction.js';
import moment from 'moment';

// Interface to define the structure of a Thought document
interface IThought extends Document {
    thoughtText: string;        // Text content of the thought
    createdAt: Date | string;   // Date the thought was created or formatted string
    username: string;           // Username of the user who created the thought
    thoughtId: Schema.Types.ObjectId;      // ID of the thought
    reactions: Types.Array<Document>;       // Array of Reaction subdocuments
    reactionCount?: number;     // Virtual field to show the count of reactions on a thought
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
            get: (timestamp: Date) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),    // Getter method to format the timestamp
        },
        // Username field to store the username of the user who created the thought
        username: {
            type: String,       // Data type is String
            required: true,     // This field is required
        },
        // ID of the thought
        thoughtId: {
            type: Schema.Types.ObjectId,    // Data type is ObjectId
            default: () => new Types.ObjectId(), // Default value is a new ObjectId
        },
        // Array of nested Reaction documents to store user reactions
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,     // Include virtual properties when data is serialized
            getters: true,      // Enable getters to apply custom formatting
        },
        timestamps: true,       // Include timestamps in the document
    }
);

// Virtual to calculate the number of reactions for a thought and return the length of the reactions array
thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions.length;
});

// Create the Thought model using the thoughtSchema
const Thought = model<IThought>('Thought', thoughtSchema);

// Export the Thought model
export default Thought;
