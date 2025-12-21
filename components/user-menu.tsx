"use client"

import { Loader2, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"

interface UserMenuProps {
    onOpenSettings?: () => void
}

export function UserMenu({ onOpenSettings }: UserMenuProps) {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/")
                        router.refresh()
                    },
                },
            })
        } finally {
            setIsSigningOut(false)
        }
    }

    if (isPending) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-8 w-8"
                disabled
            >
                <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
        )
    }

    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-none font-medium"
                >
                    <Link href="/auth">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="rounded-none font-medium">
                    <Link href="/auth">Sign Up</Link>
                </Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-none gap-2 px-2 hover:bg-accent/50"
                >
                    <div className="h-6 w-6 bg-primary/10 flex items-center justify-center rounded-none border border-primary/20">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden md:inline-block max-w-[100px] truncate">
                        {session.user.name}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 rounded-none border-border shadow-soft"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onOpenSettings && (
                    <>
                        <DropdownMenuItem
                            onClick={onOpenSettings}
                            className="rounded-none cursor-pointer"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="rounded-none cursor-pointer text-destructive focus:text-destructive"
                >
                    {isSigningOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
