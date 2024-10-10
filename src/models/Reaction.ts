import { Schema, type Document, Types } from "mongoose";
import moment from "moment";

// Interface to define the structure of a Reaction document
interface IReaction extends Document {
    reactionId: Types.ObjectId;  // Unique ID for each reaction
    reactionBody: string;       // Text content of the reaction
    username: string;           // Username of the user who created the reaction
    createdAt: Date | string;   // Date the reaction was created or formatted date string
}

// Schema to create the Reaction model
const reactionSchema = new Schema<IReaction>(
    {
        // Reaction ID field to store the unique ID for each reaction
        reactionId: {
            type: Schema.Types.ObjectId,    // Data type is ObjectId
            default: () => new Types.ObjectId(), // Default value is a new ObjectId
        },
        // Reaction body field properties
        reactionBody: {
            type: String,       // Data type is String
            required: true,     // This field is required for every reaction
            maxlength: 280,     // Maximum length of the reaction text
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
            get: (timestamp: Date) => moment(timestamp).format("MMM DD, YYYY [at] hh:mm a"),    // Getter method to format the timestamp on query
        },
    },
    {
        toJSON: {
            getters: true,      // Apply getters when data is serialized
        },
        _id: false,             // Disable automatic generation of _id field for subdocuments
    }
);

// Export the Reaction schema (subdocument) for use in the Thought model
export default reactionSchema;
