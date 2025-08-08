import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "./components/auth-form";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
    return (
        <div className="py-6 lg:py-0">
            <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 ">
                <div
                    className="relative bg-cover bg-center h-full flex-col bg-muted p-10 text-gray-50 dark:border-r lg:flex"
                    style={{ backgroundImage: `url(/assets/certsys.jpg)` }}
                >
                    {/* <div className="absolute inset-0 bg-zinc-900" /> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 z-10" />
                    <div className="relative z-20 flex items-start text-lg font-medium ">
                        <Link href={"/"}>
                            <div title="Logo da CERTSYS" className="flex flex-col items-center gap-2 text-xs lg:text-base">
                                <Home className="w-10 lg:w-14" />
                                <span className="text-cyan-900">CERTSYS</span>
                            </div>
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto top-8 lg:top-0">
                        <blockquote className="space-y-2">
                            <p className="lg:text-lg text-xs">
                                &ldquo;Certsys desempenha um papel
                                crucial ao garantir que os equipamentos utilizados na indústria de petróleo e
                                gás atendam aos mais altos padrões de segurança, qualidade e conformidade&rdquo;
                            </p>
                            <footer className="text-xs lg:text-sm">- CERTSYS</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <AuthForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Ao clicar em continuar, você concorda com os nossos{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Termos de uso
                            </Link>{" "}
                            e{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Política de privacidade
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}