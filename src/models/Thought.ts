import { Schema, model, Types, type Document } from 'mongoose';

// Interface to define the structure of a Reaction document
interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId;  // ID of the reaction
    reactionBody: string;               // Text content of the reaction
    username: string;                   // Username of the user who created the reaction
    createdAt: Date | string;           // Date the reaction was created or formatted string
}
// Interface to define the structure of a Thought document
interface IThought extends Document {
    thoughtText: string;        // Text content of the thought
    createdAt: Date | string;   // Date the thought was created or formatted string
    username: string;           // Username of the user who created the thought
    userId: Schema.Types.ObjectId | undefined; // ID of the user who created the thought
    reactions: Schema.Types.ObjectId[]; 
}

// Schema to create the Reaction
const reactionSchema = new Schema<IReaction>(
    {
        // Reaction ID field to store the unique ID for each reaction
        reactionId: {
            type: Schema.Types.ObjectId,            // Data type is ObjectId
            default: () => new Types.ObjectId(),    // Default value is a new ObjectId
        },
        // Reaction body field properties
        reactionBody: {
            type: String,   // Data type is String
            required: true, // This field is required
            maxlength: 280, // Maximum length of the reaction text
        },
        // Username field to store the username of the user who created the reaction
        username: [
            {
                type: String,   // Data type is String
                required: true, // This field is required
            }
        ],
        // createdAt field to store the date the reaction was created
        createdAt: [
            {
                type: Date,        // Data type is Date
                default: Date.now(),    
                get: (createdAt: Date) => createdAt.toLocaleDateString("en-US"),    // Getter to format the date
            }
        ],
    },
    {
        toJSON: {
            virtuals: true, // Include virtual properties when data is serialized
            getters: true,  
        },
        id: false,  // Disable automatic generation of _id field for subdocuments
    }
);

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
            default: Date.now(),  // Default value is the current timestamp when a thought is created
            get: (createdAt: Date) => createdAt.toLocaleDateString("en-US"), // Getter to format the date
        },
        // Username field to store the username of the user who created the thought
        username: {
            type: String,       // Data type is String
            required: true,     // This field is required
        },
        // Array of nested Reaction documents to store user reactions
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,     // Include virtual properties when data is serialized
            getters: true,      // Enable getters to apply custom formatting
        },
    }
);

// Virtual to calculate the number of reactions for a thought and return the length of the reactions array
thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions?.length;
});

// Create the Thought model using the thoughtSchema
const Thought = model<IThought>('Thought', thoughtSchema);

// Export the Thought model
export default Thought;
