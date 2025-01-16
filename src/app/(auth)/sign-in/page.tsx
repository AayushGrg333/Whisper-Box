"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onClickGoogle = async () => {
        setIsGoogleSubmitting(true);
        const result = await signIn("google", {
          callbackUrl: `${window.location.origin}/dashboard`,
        });
    
        setIsGoogleSubmitting(false);
    
        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      };

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setIsSubmitting(true);
            const result = await signIn("credentials", {
                redirect: false,
                identifier: data.identifier,  // Changed from email to identifier
                password: data.password,
            });

            if (result?.error) {
                console.error("Sign in error:", result.error);
                toast({
                    title: "Login failed",
                    description: result.error,
                    variant: "destructive",
                });
                return;
            }

            if (result?.ok) {
                toast({
                    title: "Success",
                    description: "Logged in successfully",
                });
                router.replace("/dashboard");
                router.refresh();
            }
        } catch (error) {
            console.error("Sign in error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Whisper Box
                    </h1>
                    <p className="mb-4">
                        Sign In to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <Input 
                                        {...field} 
                                        name="identifier"
                                        placeholder="Enter your email or username"
                                    />
                                    <p className="text-muted text-gray-400 text-sm">
                                        Enter your registered email or username
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        name="password"
                                        placeholder="Enter your password"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Haven&apos;t registered yet?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
                
        <div>
          <p className="text-sm text-gray-500 text-center">Or</p>
        </div>
        <div>
          <Button className="w-full" onClick={onClickGoogle}>
            {isGoogleSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </div>
            </div>

            
        </div>
    );
}