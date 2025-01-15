'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {Mail, MoveRight} from 'lucide-react'
import { useRouter } from "next/navigation";
import messages from "@/messages.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
    const Router = useRouter()
    return (
        <>
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Dive into the World of Anonymous Messaging
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              WhisperBox - Where your identity remains a secret.
            </p>
          </section>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full self-center max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="py-4">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mt-4">
            <button
              onClick={() => Router.push("/dashboard")}
              className="flex items-center text-sm  group"
            >
              <p className="mr-2 opacity-50 transition-all duration-300 ease-linear underline  group-hover:opacity-85">
                Go to Dashboard
              </p>
              <MoveRight className="w-7 h-4 opacity-50 transition duration-300 ease-linear group-hover:translate-x-3 group-hover:opacity-85" />
            </button>
          </div>
        </main>
        <footer className="text-center text-sm p-4 md:p-6 bg-gray-900 text-white/50">
          © 2024 WhisperBox. All rights reserved.
        </footer>
      </>
    );
}
