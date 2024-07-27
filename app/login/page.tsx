import AuthForm from "@/components/ui/authForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Login() {
    return (
       <div className="w-full my-10 flex justify-center">
         <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <AuthForm register={false}/>
            </CardContent>
            {/* <CardFooter> */}

            {/* </CardFooter>  */}
         </Card>
       </div>
    )
}
