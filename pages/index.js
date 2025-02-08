// Redeploy test: updated homepage
// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-900">Welcome to CatholicMatch</h1>
      <p className="text-lg mb-6">Find your match, curated with care.</p>
      <div>
        <Link href="/signup" className="mr-4 text-blue-500 hover:underline">
          Sign Up
        </Link>
        <Link href="/login" className="text-blue-500 hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}

