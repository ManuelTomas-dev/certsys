/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoaderPinwheel } from "lucide-react"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AuthForm({ className, ...props }: AuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const router = useRouter()

    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        // Simula carregamento de 2 segundos
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const handleLogin = () => {
        router.push('/')
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Link
                href="/registar"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8 text-xs lg:text-base"
                )}
            >
                Não tem uma conta? criar conta
            </Link>
            <form >
                <div className="relative mt-2 mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Bem vindo, bom te ver novamente!
                        </span>
                    </div>
                </div>
                <div className="grid gap-4">

                    <div className="grid gap-2">
                        <Label htmlFor="student-email">Email</Label>
                        <Input
                            id="student-email"
                            name="email"
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            required
                            className="focus-visible:ring-cyan-900 border-cyan-600"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="student-password">Senha</Label>
                        <Input
                            id="student-password"
                            name="password"
                            type="password"
                            required
                            className="focus-visible:ring-cyan-900 border-cyan-600"
                        />
                    </div>
                    <Link
                        href="/esqueci-senha"
                        className="text-sm text-accent-plum-600 hover:underline block text-right"
                    >
                        Esqueceu a senha?
                    </Link>
                    <Button onClick={handleLogin} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
                        {isLoading && (
                            <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )

}