import React from "react";
import Navbar from "components/Navbar/Navbar";
import { db } from "/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import SuperJson from "superjson";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Link from "next/link";
import { async } from "@firebase/util";
import { useAuth } from "/firebase";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

function GuessesHistory(props) {
  const { guesses, guessessub } = SuperJson.parse(props.superjson);
  const [historyList, setHistoryList] = React.useState(guesses);
  const currentUser = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const deleteHistory = async (id) => {
    try {
      let result = await deleteDoc(doc(db, "guesses", id));
      setHistoryList(
        historyList.filter((data) => (data.id === id ? null : data))
      );
    } catch (error) {
      0;
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Gueses History</title>
      </Head>

      <Navbar />

      <main className="py-10 container max-w-[1000px]  mx-auto">
        <div className="mb-10">
          <div className="flex items-center space-x-6 mb-5">
            <button
              onClick={() => router.back()}
              passHref
              className="cursor-pointer"
            >
              <MdOutlineArrowBackIos
                size={35}
                color={theme == "dark" ? "white" : "black"}
                className="cursor-pointer"
              />
            </button>
            <h1 className="font-corben text-[30px] sm:text-[50px] font-bold mb-2">
              History
            </h1>
          </div>
          {/* <button
            className="py-4 px-6 bg-red-500 rounded font-bold font-corben"
            // onClick={resetHistory}
          >
            Reset History
          </button> */}
        </div>

        <div className={`space-y-4 `}>
          {historyList.map((data, index) => {
            return (
              <div
                key={data.id}
                className={`${
                  data?.isGuessed ? "bg-green-400" : "bg-red-400"
                } py-2 px-4 sm:py-4 sm:px-6 rounded font-corben font-bold`}
              >
                <div className="flex items-center space-x-2 justify-between">
                  <h1 className="font-corben font-bold text-[16px] sm:text-[24px]">
                    Answer : {data.correctGuessValue}{" "}
                  </h1>

                  <div className="flex item-center justify-center space-x-2 sm:space-x-4">
                    <div className="flex flex-col items-center justify-center space-y-[1px] sm:space-y-[2px]">
                      <p className="text-[6px] sm:text-[16px] font-corben opacity-[.5] font-bold text-black">
                        {new Date(
                          data.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-[6px] sm:text-[16px] font-corben opacity-[.5] font-bold text-black">
                        {new Date(
                          data.createdAt.seconds * 1000
                        ).toLocaleTimeString()}
                      </p>
                    </div>

                    <Link
                      href={{
                        pathname: `/details/${data.id}`,
                        query: {
                          correctValue: data.correctGuessValue,
                          isGuessed: data.isGuessed,
                        },
                      }}
                    >
                      <a className="py-1 px-2 sm:py-2 sm:px-4 bg-blue-500 rounded flex items-center text-[10px] sm:text-[16px]">
                        Details
                      </a>
                    </Link>
                    <button
                      onClick={() => deleteHistory(data.id)}
                      className="py-1 px-2 sm:py-2 sm:px-4 bg-red-700 rounded flex items-center text-[10px] sm:text-[16px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default GuessesHistory;

export async function getServerSideProps(context) {
  let guesses = [];

  const q = query(
    collection(db, "guesses"),
    where("userId", "==", context.params.id),
    orderBy("createdAt", "desc")
  );
  let snapshot = await getDocs(q);

  snapshot.docs.forEach((doc) => {
    guesses = [...guesses, { ...doc.data(), id: doc.id }];
  });

  return {
    props: {
      superjson: SuperJson.stringify({
        guesses: guesses,
      }),
    },
  };
}
