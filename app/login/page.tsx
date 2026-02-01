'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTheme } from '@/components/settings/theme-provider';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C44.434 36.316 48 30.659 48 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}


export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { farmName, loginImageUrl } = useTheme();

  const loginImageDefault = PlaceHolderImages.find((p) => p.id === 'login-cow');
  const displayImageUrl = loginImageUrl || loginImageDefault?.imageUrl;
  const displayImageHint = loginImageDefault?.imageHint || 'cow';


  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };
  
  if (isLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
         {displayImageUrl && (
             <Image
                src={displayImageUrl}
                alt="Fondo de inicio de sesión"
                fill
                className="object-cover brightness-75"
                data-ai-hint={displayImageHint}
              />
        )}
        <div className="relative z-20 flex items-center text-5xl font-extrabold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {farmName.toUpperCase()}
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="mx-auto w-full max-w-sm border-2">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold">Bienvenido</CardTitle>
                <CardDescription>
                Inicia sesión para gestionar el ganado de {farmName}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                <Button variant="default" className="w-full text-lg py-6" onClick={handleSignIn}>
                    <GoogleIcon className="mr-3 h-6 w-6" />
                    Continuar con Google
                </Button>
                </div>
                <div className="mt-4 text-center text-xs text-muted-foreground">
                    Solo personal autorizado.
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
