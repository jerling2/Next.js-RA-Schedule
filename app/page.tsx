"use client";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { User } from 'firebase/auth';
import { useEffect } from 'react';
import { fetchAuthToken } from '@/lib/client/auth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {

    const login = async (user: User) => {
        await fetchAuthToken(user);
        router.push("/dashboard");
    }

    // Browser is still loading - do not attempt to process the user.
    if (loading === true) {
      return;
    }

    // User is not logged in - direct user to the login page. 
    if (user === null) {
      return router.push("/welcome");
    }
    
    // User is logged in - attempt to go to dashboard.
    login(user);

  }, [user, loading]);

}