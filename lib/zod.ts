import { boolean, object, string, z, number, coerce } from "zod"
// import mongoose from "mongoose"

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid Email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters")
})

export const nodeSchema = object({
    name: string({ required_error: "Name is required" }),
    mac: string({ required_error: "Mac Address is required" }),
    status: string(),
    ip_add: string(),
    port: coerce.number().int(),
})
