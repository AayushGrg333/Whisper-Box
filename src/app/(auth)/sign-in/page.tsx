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

export default function SignInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        if (result?.error) {
            toast({
                title: "Login failed",
                description: "Incorrect username or password",
                variant: "destructive",
            });
        }
        setIsSubmitting(false);
        if (result?.url) {
            router.replace("/dashboard");
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
                                    <FormLabel>Email/username</FormLabel>
                                    <Input {...field} name="email/username" />
                                    <p className="text-muted text-gray-400 text-sm">
                                        We will send you a verification code
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
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        haven&apos;t registered yet?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
