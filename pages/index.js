import Navbar from "components/Navbar/Navbar";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "/firebase";
import { useRecoilState } from "recoil";
import { FcGoogle } from "react-icons/fc";
import GuessingInput from "components/GuessingInput/GuessingInput";
import { guessState } from "atoms/guessState";
import { useAuth } from "/firebase";
import { BiHistory } from "react-icons/bi";
import { AiOutlineHistory } from "react-icons/ai";
import Link from "next/link";

export default function Home() {
  const [gameState, setGameState] = useRecoilState(guessState);
  const { number, isGuessed, steps, totalGuesses } = gameState;
  const currentUser = useAuth();

  const playAgain = () => {
    setGameState({
      ...gameState,
      number: 0,
      hint: "",
      isGuessed: "",
      steps: 0,
      totalGuesses: [],
      id: "",
      gameStarted: false,
    });
  };

  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const userResult = result.user;
        console.log(userResult);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(errorMessage);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex flex-col items-center text-center mb-[80px] flex-1 justify-center">
        {isGuessed ? (
          <div className="text-center ">
            <h1 className="font-corben font-bold text-[60px] mb-6 text-custom-yellow leading-none">
              Hurray
            </h1>

            <div className="space-y-4 mb-10">
              <h1 className="font-corben font-bold text-[50px] text-green-500 leading-none">
                You Guessed It
              </h1>
              <h2 className="font-corben font-bold text-[50px]  leading-none">
                In{" "}
                <span className="text-green-500 font-corben font-bold">
                  {steps === 0 ? 1 : steps}
                </span>{" "}
                {steps === 1 || steps === 0 ? "Try" : "Tries"}
              </h2>
            </div>
            <h1 className="leading-none flex items-center space-x-5 justify-center mb-7">
              <span className="font-corben font-bold text-[80px] dark:text-white text-black ">
                IT IS
              </span>{" "}
              <span className="text-green-500 font-corben text-[80px] font-bold">
                {number}
              </span>
            </h1>

            <div className="flex items-center justify-center space-x-4">
              <button
                className="font-corben text-[22px] px-[20px] py-[12px] bg-blue-500 text-white flex items-center space-x-3 rounded outline-none"
                onClick={playAgain}
              >
                <span className="font-trirong">Play Again</span>{" "}
                <BsArrowCounterclockwise color="white" />
              </button>
              <Link href={`/guesses-history/${currentUser?.uid}`} passHref>
                <a className="font-corben text-[22px] px-[20px] py-[12px] bg-custom-yellow text-white flex items-center space-x-3 rounded outline-none">
                  <span className="font-trirong">Watch History</span>{" "}
                  <BiHistory color="white" />
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-5">
              <h1 className="font-corben dark:text-white font-extrabold mb-[8px] text-[60px]">
                Guessing Game
              </h1>
              <h1 className="font-corben dark:text-white text-[30px] mb-3 font-black capitalize">
                Made By Abdullah
              </h1>
            </div>

            {!currentUser ? (
              <button
                onClick={googleSignIn}
                className="flex items-center space-x-3 dark:bg-white bg-gray-800 rounded px-5 py-3 shadow-lg"
              >
                <FcGoogle size={30} />
                <span className="font-trirong text-[18px] dark:text-gray-800 text-white font-bold">
                  Sign in With Google{" "}
                </span>{" "}
              </button>
            ) : (
              <GuessingInput />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
