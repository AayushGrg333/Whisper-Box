'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {MoveRight} from 'lucide-react'
import { useRouter } from "next/navigation";

import messages from "@/messages.json";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
    const Router = useRouter()
    return (
      <>
        <main
            className=" flex-grow flex flex-col items-center justify-center
    px-4 md:px-24 py-12"
        >
            <section className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-bold">
                    Join World of anonymous Conversations
                </h1>
                <p className="mt-3 md:mt-3 text-base md:text-lg">
                    Explore WhisperBox - Where you identity remains a secret.{" "}
                </p>
            </section>

            <Carousel
                className="w-full self-center max-w-lg md:max-w-[300px]"
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
            >
                <CarouselContent>
                {
                  messages.map((message,index)=>(
                    <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                  <CardHeader>{message.title}</CardHeader>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-2xl font-semibold">
                                            {message.content}
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                  ))
                }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </main>
        <span
          onClick={() => Router.push("/dashboard")}
          className="mb-5 text-2xl text-blue-900 flex justify-center items-center group cursor-pointer"
        >
        <p className="ml-1 group-hover:underline">Checkout Messages</p>
          <MoveRight  className="w-6 h-4 transition-transform duration-300 ease-linear group-hover:translate-x-4 " />
        </span>
        <footer className="text-center">@2025 WhisperBox. All rights reserved.</footer>
        </>
    );
}
