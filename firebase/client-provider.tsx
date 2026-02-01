'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { Loader2 } from 'lucide-react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebaseInstances, setFirebaseInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const init = async () => {
      const instances = await initializeFirebase();
      setFirebaseInstances(instances);
    };
    init();
  }, []);

  if (!firebaseInstances) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return <FirebaseProvider {...firebaseInstances}>{children}</FirebaseProvider>;
}
