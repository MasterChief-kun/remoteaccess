'use client'

import { nodeSchema, signInSchema } from "@/lib/zod";
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
//
import { createNode, createUser, signInServ } from "@/lib/db";
//
import { useRouter } from "next/navigation";
import dbConnect from "@/lib/mongoUtils";
import { DialogClose } from "./dialog";
// import dbConnect from "@/lib/mongoUtils";
type NodeFormProps = {
  edit?: boolean;
  editObj?: object;
}

export default function NodeForm(props: NodeFormProps){
  const router = useRouter()

  const form = useForm<z.infer<typeof nodeSchema>>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      name: props.editObj?.name || "",
      mac: props.editObj?.mac || "",
      port: props.editObj?.port || 22,
      status: props.editObj?.status || "off",
      ip_add: props.editObj?.ip_add || ""
    }
  })
  async function onSubmit(values: z.infer<typeof nodeSchema>) {
    // await dbConnect()
    // "use server"
    // console.log(values)
    // if(!props.register) {
    //   // await signIn("credentials", values);
    //   await signInServ(values).catch(err => {
    //       router.push("/register")
    //   });
    // } else {
    //   // console.log(values)
    //   let pwdHash = await saltAndHashPwd(values.password)
    //   await createUser({'email':values.email, 'password':pwdHash})
    // }
    // "use server"
    // await dbConnect();
    if(!props.edit) {
      await createNode(values).then(() => {
        router.push("/")
      })
    } else {
      let req = await fetch(`/api/node/update?id=${props.editObj._id}`, {
        method: "POST",
        body: JSON.stringify(values)
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
    control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={props?.editObj?.name} {...field} />
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
            name="mac"
            render={({field}) => (
              <FormItem>
                <FormLabel>Mac Address</FormLabel>
                <FormControl>
                  <Input placeholder={props?.editObj?.mac} {...field}/>
                </FormControl>
              </FormItem>
            )}
          >

          </FormField>
        <FormField
    control={form.control}
            name="ip_add"
            render={({field}) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input placeholder={props?.editObj?.ip_add} {...field}/>
                </FormControl>
              </FormItem>
            )}
          >

          </FormField>
            <FormField
    control={form.control}
            name="port"
            render={({field}) => (
              <FormItem>
                <FormLabel>SSH Port</FormLabel>
                <FormControl>
                  <Input placeholder={props?.editObj?.port} type="number" {...field}/>
                </FormControl>
              </FormItem>
            )}
          >

          </FormField>
           <div>
             { /* <DialogClose asChild> */}
                <Button className="w-full" type="submit">
                  { props.edit ? <div>Edit</div>: <div>Save</div> }
                </Button>
            {/* </DialogClose> */}
          </div>
        </form>
    </Form>
  )
}
