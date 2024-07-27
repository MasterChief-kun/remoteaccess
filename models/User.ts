export const runtime = 'nodejs'
import mongoose from "mongoose"
const { Schema } = mongoose;

export interface User extends mongoose.Document {
    email: string;
    password: string;
    image_url: string;
    role: string;
}

const UserSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: false,
        default: "https://immich78518.xinit.se/api/assets/ca436dd2-b92b-42d9-b864-efef5f1e1268/thumbnail?size=preview&key=o_Vy4DiSbOT-R8LqguZkkMvZ6XM9yQjiinODsfSkf4DH3pHN8wiZBRjsahdPoZufip4&c=NHQmWeFcnFj%2BuAnZ8IS4VTK38q0%3D"
    },
    role: {
        type: String,
        required: true,
        default: "viewer"
    }
});


export default mongoose.models?.User || mongoose.model<User>("User", UserSchema)
