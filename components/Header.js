// components/Header.js
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-center bg-blue-900 text-white p-4">
      <Image src="/images/cross.png" alt="Catholic Cross" width={40} height={40} className="mr-2" />
      <h1 className="text-2xl font-bold">Volo</h1>
    </header>
  );
}


  