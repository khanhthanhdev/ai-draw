"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authClient } from "@/lib/auth-client"

export function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await authClient.signIn.email(
                {
                    email,
                    password,
                },
                {
                    onSuccess: () => {
                        toast.success("Signed in successfully")
                        router.push("/")
                        router.refresh()
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    },
                },
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await authClient.signUp.email(
                {
                    email,
                    password,
                    name,
                },
                {
                    onSuccess: () => {
                        toast.success("Account created successfully")
                        router.push("/")
                        router.refresh()
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    },
                },
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <Card className="rounded-none border-border shadow-soft-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Authentication
                    </CardTitle>
                    <CardDescription>
                        Sign in to your account or create a new one to save your
                        diagrams.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 p-1 mb-4">
                            <TabsTrigger
                                value="signin"
                                className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:font-bold border-none ring-0"
                            >
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:font-bold border-none ring-0"
                            >
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input
                                        id="signin-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="rounded-none"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        required
                                        className="rounded-none"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full rounded-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Name</Label>
                                    <Input
                                        id="signup-name"
                                        placeholder="Your Name"
                                        required
                                        className="rounded-none"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="rounded-none"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        className="rounded-none"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full rounded-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
