// pages/index.js
export const dynamic = "force-dynamic"; // ✅ Ensures no SSR issues

import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome to Volo</h1>
      <p>This is the homepage.</p>
    </div>
  );
}