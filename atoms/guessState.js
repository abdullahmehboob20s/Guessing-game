const { atom } = require("recoil");

export const guessState = atom({
  key: "guessState",
  default: {
    number: 0,
    hint: "",
    isGuessed: "",
    steps: 0,
    totalGuesses: [],
    id: "",
    gameStarted: false,
  },
});
