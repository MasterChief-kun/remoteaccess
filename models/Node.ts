import mongoose from "mongoose"
const { Schema } = mongoose;

export interface Node extends mongoose.Document {
    name: string;
    mac: string
}

const NodeSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    mac : {
        type: String,
        required: true
    },
    status : {
        type: String,
        enum: ['on', 'off', 'loading']
    },
    ip_add : {
        type: String
    },
    port: {
        type: Number,
        default: 22
    }
});


export default mongoose.models?.Node || mongoose.model<Node>("Node", NodeSchema)
