import { Schema, Types, Document, ObjectId } from "mongoose";

// Interface to define the structure of a Reaction document
interface IReaction extends Document {
    reactionId: ObjectId;       // Unique identifier for the reaction
    reactionBody: string;       // Text content of the reaction
    username: string;           // Username of the user who created the reaction
    createdAt: Date;            // Date the reaction was created
}

// Schema to create the Reaction model
const reactionSchema = new Schema<IReaction>(
    {
        // Reaction ID field to store the unique identifier of the reaction
        reactionId: {
            type: Schema.Types.ObjectId,    // Data type is ObjectId
            default: () => new Types.ObjectId(),  // Default value is a new ObjectId
        },
        // Reaction body field properties
        reactionBody: {
            type: String,       // Data type is String
            required: true,     // This field is required for every reaction
            maxlength: 250,     // Maximum length of the reaction text
        },
        // Username field to store the username of the user who created the reaction
        username: {
            type: String,       // Data type is String
            required: true,     // This field is required
        },
        // createdAt field to store the date the reaction was created
        createdAt: {
            type: Date,         // Data type is Date
            default: Date.now,  // Default value is the current timestamp when a reaction is created
        },
    },
    {
        toJSON: {
            getters: true,      // Apply getters when data is serialized
        },
        id: false,              // Disable virtual "id" property
    }
);

// Export the Reaction model
export default reactionSchema;
