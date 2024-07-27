'use client'

import { signInSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {default as User} from "@/models/User";
import { saltAndHashPwd } from "@/lib/cryptoUtils";
import { createUser, signInServ } from "@/lib/db";
import { useRouter } from "next/navigation";
// import dbConnect from "@/lib/mongoUtils";

type AuthFormProps = {
 register: boolean;
}

export default function AuthForm(props : AuthFormProps){
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // await dbConnect()
    // "use server"
    // console.log(values)
    if(!props.register) {
      // await signIn("credentials", values);
      await signInServ(values).catch(err => {
          router.push("/register")
      });
    } else {
      // console.log(values)
      let pwdHash = await saltAndHashPwd(values.password)
      await createUser({'email':values.email, 'password':pwdHash})
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
    control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johnsmith@acme.com" {...field} />
                </FormControl>
                {/* <FormDescription> */}
                {/*   Your Email Address. */}
                {/* </FormDescription> */}
              </FormItem>
            )}
          >
          </FormField>
          <FormField
    control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field}/>
                </FormControl>
              </FormItem>
            )}
          >

          </FormField>
          <div>
            <Button className="w-full" type="submit">{props.register ? "Register":"Sign In"}</Button>
          </div>
        </form>
    </Form>
  )
}
