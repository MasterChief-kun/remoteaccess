"use server"

import { z } from "zod"
import { signInSchema, nodeSchema } from "./zod";
import User from "@/models/User";
import { signIn } from "@/auth";
import { permanentRedirect, redirect } from "next/navigation"
import Node from "@/models/Node"

export async function createUser(values: z.infer<typeof signInSchema>) {
    await User.create({ 'email':values.email, 'password':values.password }).catch(err => {
        console.error(err.message)
    });
    // await newUser.save()
}

export async function createNode(values: z.infer<typeof nodeSchema>) {
    await Node.create(values).catch(err => {
        console.error(err.message)
    })
}

export async function signInServ(values: z.infer<typeof signInSchema>) {
    await signIn("credentials", values).catch(err => {
        console.error(err.message)
        throw err
    });
}
