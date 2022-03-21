import React from "react";
import { useTheme } from "next-themes";
import { BsFillMoonFill } from "react-icons/bs";
import { FaSun } from "react-icons/fa";
import { auth } from "/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "/firebase";
import Link from "next/link";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const currentUser = useAuth();

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="bg-[#ffc56f] dark:bg-[#292929]">
      <div className="container">
        <div className="h-[80px] flex items-center justify-between">
          <Link href="/" passHref className="cursor-pointer">
            <h1 className="font-corben font-extrabold text-[18px] sm:text-[26px] cursor-pointer">
              GUESS IT
            </h1>
          </Link>

          <div className="flex items-center space-x-6">
            <button
              className="cursor-pointer"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <BsFillMoonFill size={24} color="black" />
              ) : (
                <FaSun size={24} color="white" />
              )}
            </button>

            {currentUser ? (
              <button onClick={logout}>
                <img
                  className="relative rounded-full sm:w-[45px] sm:h-[45px] w-[35px] h-[35px]"
                  src={currentUser?.photoURL}
                  alt=""
                />
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
