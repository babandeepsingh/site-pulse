"use client"

import { SignIn } from "@clerk/clerk-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {isSignedIn ? <><UserButton /> <h6>Welcome, {user?.fullName}</h6></> : <SignIn routing="hash" />
      }

    </div>
  );
}
