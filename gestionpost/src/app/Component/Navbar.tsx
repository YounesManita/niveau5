"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
   
    const storedUserId = localStorage.getItem("iduser");
    setIsAuthenticated(!!storedUserId); 
  }, []);

  const handleLogout = () => {
   
  localStorage.clear()
    setIsAuthenticated(false); 
    router.push("/Login"); 
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white">
          Home
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/Post" className="text-white">
              Liste Posts
            </Link>
            <button onClick={handleLogout} className="text-white">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
