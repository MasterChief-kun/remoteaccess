import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react";
import ModeToggle from "@/components/ui/ModeToggle";
import { SessionProvider, signOut } from "next-auth/react"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/auth"
import dbConnect from "@/lib/mongoUtils";
import AuthButton from "@/components/ui/signInButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await dbConnect();
  let session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="flex min-h-screen w-full flex-col opacity-100"
          >
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                  href="/"
                  className="text-foreground gap-4 transition-colors hover:text-foreground"
                >
                    {process.env.NAME}
                </Link>
                </nav>
                <div className="flex w-full justify-end items-center gap-8 md:ml-auto md:gap-4 lg:gap-8">
                 <AuthButton session={session}/>
                  {/* <Link */}
                  {/*   href="/post" */}
                  {/*   className="text-muted-foreground transition-colors hover:text-foreground" */}
                  {/* > */}
                  {/*   Posts */}
                  {/* </Link> */}

                  <Avatar>
                    <AvatarImage src={session?.user?.image_url}/>
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>

                  <ModeToggle/>
                </div>
            </header>
            <SessionProvider session={session}>
                {children}
                {/* {authSlot} */}
            </SessionProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
