'use client'

import { signInSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUser, signInServ } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type AuthFormProps = {
 register: boolean;
}

export default function AuthForm(props : AuthFormProps){
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setError(null)
    setLoading(true)
    try {
      if(!props.register) {
        const res = await signInServ(values);
        if (res?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await createUser(values);
        if (res?.success) {
          await signInServ(values);
          router.push("/");
          router.refresh();
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johnsmith@acme.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Processing..." : (props.register ? "Register" : "Sign In")}
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {props.register ? (
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline hover:text-primary/80">
                Sign In
              </Link>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline hover:text-primary/80">
                Register
              </Link>
            </p>
          )}
        </div>
      </form>
    </Form>
  )
}
