import React from "react";
import Navbar from "components/Navbar/Navbar";
import { db } from "/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import SuperJson from "superjson";
import { MdOutlineArrowBackIos } from "react-icons/md";
import Link from "next/link";
import { async } from "@firebase/util";
import { useAuth } from "/firebase";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

function Details(props) {
  const { guesses } = SuperJson.parse(props.superjson);
  const { id } = props;
  const currentUser = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { correctValue, isGuessed } = router.query;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Details</title>
      </Head>

      <Navbar />

      <main className="py-10 container max-w-[1000px]  mx-auto">
        <div className="flex items-center space-x-6 mb-10">
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
            History Details
          </h1>
        </div>

        <div className="mb-10">
          {isGuessed === true || guesses.length !== 0 ? (
            <h1 className="text-[18px] sm:text-[30px] dark:text-white text-black font-corben font-bold mb-2">
              Guessed In{" "}
              <span className="font-corben text-custom-yellow">
                {(new Date(guesses[0]?.createdAt.seconds * 1000).getTime() -
                  new Date(
                    guesses[guesses.length - 1]?.createdAt?.seconds * 1000
                  ).getTime()) /
                  1000}{" "}
                Seconds{" "}
              </span>{" "}
              and{" "}
              <span className="font-corben text-custom-yellow">
                {" "}
                {guesses.length} Tries
              </span>
            </h1>
          ) : (
            ""
          )}

          {guesses.length == 0 ? (
            <h1 className="text-[18px] sm:text-[30px] text-white font-corben font-bold text-center opacity-[.3]">
              No Histroy Details
            </h1>
          ) : (
            ""
          )}
        </div>

        <div className={`space-y-4 `}>
          {guesses.map((data, index) => {
            return (
              <div
                key={data.id}
                className={`${
                  correctValue == data.guess ? "bg-green-400" : "bg-red-400"
                } py-2 px-4 sm:py-4 sm:px-6 rounded font-corben font-bold`}
              >
                <div className="flex items-center space-x-2 justify-between">
                  <h1 className="font-corben font-bold text-[20px] sm:text-[24px]">
                    Guess : {data.guess}{" "}
                  </h1>

                  <div className="flex item-center justify-center space-x-2">
                    <div className="flex flex-col items-center space-y-[2px]">
                      <p className="text-[12px] sm:text-[16px] font-corben opacity-[.5] font-bold text-black">
                        {new Date(
                          data.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-[12px] sm:text-[16px] font-corben opacity-[.5] font-bold text-black">
                        {new Date(
                          data.createdAt.seconds * 1000
                        ).toLocaleTimeString()}
                      </p>
                    </div>
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

export default Details;

export async function getServerSideProps(context) {
  let guesses = [];

  const q = query(
    collection(db, `guesses/${context.params.id}/total-guesses`),
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
      id: context.params.id,
    },
  };
}
