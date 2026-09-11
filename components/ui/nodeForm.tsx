'use client'

import { nodeSchema } from "@/lib/zod";
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
import { createNode } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useState } from "react";

type editObjInt = {
  _id?: string;
  name: string;
  mac: string;
  port: number;
  status?: string;
  ip_add?: string;
}

type NodeFormProps = {
  edit?: boolean;
  editObj?: editObjInt;
  onSuccess?: () => void;
}

export default function NodeForm(props: NodeFormProps){
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    setLoading(true)
    try {
      if(!props.edit) {
        await createNode(values)
        router.refresh()
        if (props.onSuccess) props.onSuccess()
      } else {
        await fetch(`/api/node/update?id=${props?.editObj?._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        router.refresh()
        if (props.onSuccess) props.onSuccess()
      }
    } catch (err: any) {
      console.error("Node save error:", err);
      setError(err?.message || "Failed to save node");
    } finally {
      setLoading(false)
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
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Media-Server" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mac"
          render={({field}) => (
            <FormItem>
              <FormLabel>MAC Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 00:11:22:33:44:55" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ip_add"
          render={({field}) => (
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 192.168.1.50" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="port"
          render={({field}) => (
            <FormItem>
              <FormLabel>SSH Port</FormLabel>
              <FormControl>
                <Input type="number" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Saving..." : (props.edit ? "Update Node" : "Create Node")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
