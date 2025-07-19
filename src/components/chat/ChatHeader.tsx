"use client";

import { History, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function ChatHeader() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="p-4 flex items-center justify-between z-10 bg-background border-b">
      <div className="flex items-center gap-3">
        {/* Logo untuk Mode Terang */}
        <Image
          className="dark:hidden"
          alt="logo"
          src={"/hadelogo.png"}
          width={100}
          height={40}
        />
        {/* Logo untuk Mode Gelap */}
        <Image
          className="hidden dark:block"
          alt="logo"
          src={"/hadelogowhite.png"}
          width={100}
          height={40}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost">
          <History className="w-5 h-5 mr-2" />
          History
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="relative">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        </div>
      </div>
    </header>
  );
}
