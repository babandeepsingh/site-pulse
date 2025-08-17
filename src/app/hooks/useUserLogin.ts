import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UserData {
  id: number;
  email: string;
  ispremium: boolean;
  accounttype: any;
  fullname: string;
  loginid: string;
}

export function useUserLogin() {
  const { isSignedIn, user } = useUser();
  console.log(isSignedIn, user, "Wohoo2:::")
  const [userData, setUserData] = useState<UserData | null>(null);

  const initiateSignIn = async () => {
    if (isSignedIn && user) {
      const result = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          fullName: user.fullName,
          user: user
        }),
      });
      const data = await result.json();
      setUserData(data.user);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      initiateSignIn();
    }
  }, [isSignedIn, user]);

  return { isSignedIn, userData };
}
