import { Session } from "next-auth"

declare module 'next-auth'{
    // interface Session {
    //     _id: string;
    //     password: string;
    //     image_url: string;
    //     role: string;
    // }
    interface User {
        _id: string;
        password: string;
        image_url: string;
        role: string
    }
}
