// components/Header.js
export default function Header() {
    return (
      <header className="flex items-center justify-center bg-blue-900 text-white p-4">
        {/* Make sure you have a cross icon image in public/images/cross.png */}
        <img src="/images/cross.png" alt="Catholic Cross" className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold">CatholicMatch</h1>
      </header>
    );
  }
  