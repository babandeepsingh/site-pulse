"use client"

import { SignIn } from "@clerk/clerk-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";


interface userInterface {
  id: number,
  email: string,
  ispremium: boolean,
  accounttype: any,
  fullname: string,
  loginid: string
}
export default function Home() {
  const { isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<userInterface | null>(null)
  const [sites, setSites] = useState<{ [key: string]: any }>({});

  const initiateSignIn = async (users: any) => {
    if (isSignedIn) {

      const result = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, email: user.emailAddresses[0]?.emailAddress, fullName: user.fullName, user: user }),
      });
      const data = await result.json(); // ✅ parse JSON response
      setUserData(data.user)
      console.log("POST:userMessage", data.user);
    }
  }

  useEffect(() => {
    if (userData?.id) {
      fetch('/api/check/' + userData.id)
        .then((response) => response.json())
        .then((data) => {
          setSites(data.sites);
          console.log("Fetched sites:", data.sites);
        })

      const results = fetch('/api/check/' + userData.id + '/1'); // Example siteId, replace with actual siteId if needed

      // const data = await result.json(); // ✅ parse JSON response
    }
  }, [userData?.id])


  useEffect(() => {
    user && initiateSignIn(user)
  }, [isSignedIn, user]);

  return (
    <div className="font-sans px-32 h-screen">
      {isSignedIn ? <><div className="flex justify-end"><UserButton /></div> <div className="grid"><h6>Welcome, {user?.fullName}</h6></div></> : <SignIn routing="hash" />
      }

    </div>
  );
}
