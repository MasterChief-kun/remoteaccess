"use server"

import { z } from "zod"
import { signInSchema, nodeSchema } from "./zod";
import User from "@/models/User";
import { signIn } from "@/auth";
import Node from "@/models/Node"
import dbConnect from "@/lib/mongoUtils";
import { saltAndHashPwd } from "@/lib/cryptoUtils";

export async function createUser(values: z.infer<typeof signInSchema>) {
    await dbConnect();
    const hashedPassword = await saltAndHashPwd(values.password);
    const user = await User.create({ email: values.email, password: hashedPassword });
    return { success: true, userId: user._id.toString() };
}

export async function createNode(values: z.infer<typeof nodeSchema>) {
    await dbConnect();
    const node = await Node.create(values);
    return { success: true, nodeId: node._id.toString() };
}

export async function signInServ(values: z.infer<typeof signInSchema>) {
    return await signIn("credentials", {
        ...values,
        redirect: false,
    });
}
