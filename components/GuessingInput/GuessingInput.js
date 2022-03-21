import { guessState } from "atoms/guessState";
import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { BiHistory } from "react-icons/bi";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "/firebase";
import { useAuth } from "/firebase";
import Link from "next/link";

function GuessingInput() {
  const [gameState, setGameState] = useRecoilState(guessState);
  const { number, hint, isGuessed, steps, totalGuesses, gameStarted, id } =
    gameState;
  const currentUser = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      guess: null,
    },
  });

  const newGame = () => {
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

  const startGame = async () => {
    let guessValue = Math.floor(Math.random() * 100);

    try {
      let result = await addDoc(collection(db, "guesses"), {
        correctGuessValue: guessValue,
        isGuessed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setGameState({
        ...gameState,
        id: result.id,
        gameStarted: true,
        number: guessValue,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const q = query(collection(db, "guesses"));
  // const querySnapshot = await getDocs(q);
  // const queryData = querySnapshot.docs.map((detail) => ({
  //   ...detail.data(),
  //   id: detail.id,
  // }));

  // await setDoc(doc(db, `guesses/${id}/totalGuesses`, `guess-${guessNumber}`), {
  //   guess: 43,
  //   isCorrectGuess: false,
  // });

  const Submit = async (data) => {
    if (data.guess == number) {
      setGameState({
        ...gameState,
        hint: "",
        isGuessed: true,
        steps: (steps = steps + 1),
        totalGuesses: [
          ...totalGuesses,
          { guess: data.guess, timeStamp: new Date().getTime() },
        ],
      });

      await updateDoc(doc(db, "guesses", gameState.id), {
        isGuessed: true,
      });

      reset();
    } else if (data.guess > number) {
      setGameState({
        ...gameState,
        isGuessed: false,
        hint: `Number is less than ${data.guess}`,
        steps: (steps = steps + 1),
        totalGuesses: [
          ...totalGuesses,
          { guess: data.guess, timeStamp: new Date().getTime() },
        ],
      });
    } else if (data.guess < number) {
      setGameState({
        ...gameState,
        isGuessed: false,
        hint: `Number is Greator than ${data.guess}`,
        steps: (steps = steps + 1),
        totalGuesses: [
          ...totalGuesses,
          { guess: data.guess, timeStamp: new Date().getTime() },
        ],
      });
    }

    try {
      let result = await addDoc(
        collection(db, `guesses/${gameState.id}/total-guesses`),
        {
          index: steps,
          guess: data.guess,
          isCorrectGuess: data.guess == number ? true : false,
          createdAt: serverTimestamp(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {gameStarted ? (
        <>
          <div className="mb-[20px] sm:mb-[40px]">
            <h1 className="font-corben text-[16px] sm:text-[20px] mb-[3px]">
              Guess Any Number between
            </h1>
            <span className=" text-[#ffa822] text-[18px] sm:text-[20px] font-corben font-semibold">
              0 - 100
            </span>
          </div>

          <h2
            className={`font-corben ${
              getValues("guess") === number ? "text-green-500" : "text-red-500"
            }  mb-5 font-semibold text-[16px]`}
          >
            {hint}
          </h2>

          <div>
            <form
              onSubmit={handleSubmit(Submit)}
              className="flex overflow-hidden "
            >
              <input
                type="number"
                placeholder="Guess a Number"
                autoFocus={true}
                className={`py-[14px] sm:py-[20px] px-[20px] sm:px-[20px] text-[18px] sm:text-[20px] font-corben outline-none leading-normal w-[200px] sm:w-[240px] border-2  border-r-0 rounded-tl-[15px] rounded-bl-[15px] text-custom-yellow
  bg-gray-900
  
  ${isGuessed === false && "border-red-500 text-red-500"}
  ${isGuessed === "" && "border-custom-yellow text-custom-yellow"}
  `}
                {...register("guess", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Value Should be Greator Than 0",
                  },
                  max: {
                    value: 100,
                    message: "Value Should be Less Than 100",
                  },
                  required: { value: true, message: "Value is Required" },
                })}
              />
              <button
                type="submit"
                className={`min-w-[80px] sm:min-w-[110px] text-[14px] sm:text-[18px] text-gray-700 font-corben font-semibold bg-custom-yellow leading-normal rounded-tr-[15px] rounded-br-[15px]  
  
  ${isGuessed === false && "bg-red-500"}
  ${isGuessed === "" && "bg-custom-yellow"}
  `}
              >
                Guess
              </button>
            </form>

            <p className="text-red-500 mt-3 font-corben text-center text-[14px] sm:text-[16px]">
              {errors?.guess?.message}
            </p>
          </div>

          <button
            onClick={newGame}
            className="py-3 px-6 bg-red-500 rounded text-[20px] mt-6"
          >
            Exit
          </button>
        </>
      ) : (
        <div className="flex items-center sm:space-x-4 space-x-2">
          <button
            className="bg-green-500 py-2 sm:py-3 sm:px-6 px-4 rounded-lg text-[16px] sm:text-[20px] font-bold"
            onClick={startGame}
          >
            Start Game
          </button>

          <Link href={`/guesses-history/${currentUser?.uid}`} passHref>
            <a className="font-corben  font-bold text-[16px] sm:text-[22px] px-4 py-2 sm:px-[20px] sm:py-[12px] bg-custom-yellow text-white flex items-center space-x-3 rounded outline-none">
              <span className="font-trirong">Watch History</span>{" "}
              <BiHistory color="white" />
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}

export default GuessingInput;
