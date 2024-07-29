'use client'

import { Session } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./button"

type AuthButtonProps = {
  session?: Session | null;
}

export default function AuthButton(props: AuthButtonProps) {
  const session = props.session

  return (
    session?.user ?
        <Button onClick={() => {signOut()}} className='transition-colors'>
        Sign Out
        </Button>
        :
        <Link href="/login" className='text-muted-foreground transition-colors hover:text-foreground'>
        Login
        </Link>

  )
}
