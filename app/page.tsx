"use client";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { User } from 'firebase/auth';
import { useEffect } from 'react';
import { signinJWT } from '@/lib/client/auth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    const login = async (user: User) => {
        await signinJWT(user);
    }
    if (loading === true) {
      return;
    }
    if (user === null) {
      router.push("/welcome");
    } else {
      login(user);
    }
  }, [user, loading]);

}