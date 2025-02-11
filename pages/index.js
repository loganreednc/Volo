export const dynamic = "force-dynamic"; // ✅ Ensures no SSR issues

import { useEffect, useState } from "react";
import Head from 'next/head';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      setHasError(true);
      console.error("ErrorBoundary caught an error:", error);
    };

    window.addEventListener("error", errorHandler);
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return <div className="p-4 text-red-500">Something went wrong. Please try again later.</div>;
  }

  return children;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>Welcome to Volo</title>
        <meta name="description" content="This is the homepage of Volo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to Volo</h1>
        <p>This is the homepage.</p>
      </div>
    </ErrorBoundary>
  );
}