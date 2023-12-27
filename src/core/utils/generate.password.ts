import { getRandomInteger, getRandomArrayItem } from "./get.random";
import {
  lowerCharList,
  upperCharList,
  numberList,
  symbolList,
} from "./password.characters";

type generatePassword = () => string;

export const generatePassword: generatePassword = () => {
  const minLength: number = 8;
  const maxLength: number = 12;
  const passwordLength: number = getRandomInteger({
    min: minLength,
    max: maxLength,
  });
  const maxUpCharNumber: number = passwordLength - 3;
  const upChartNumber: number = getRandomInteger({
    min: 1,
    max: maxUpCharNumber,
  });
  const maxNumNumber: number = passwordLength - (upChartNumber + 2);
  const numNumber: number = getRandomInteger({
    min: 1,
    max: maxNumNumber,
  });
  const maxSymbolNumber: number =
    passwordLength - (upChartNumber + numNumber + 1);
  const symbolNumber: number = getRandomInteger({
    min: 1,
    max: maxSymbolNumber,
  });
  const lowCharNumber: number =
    passwordLength - (upChartNumber + numNumber + symbolNumber);
  let finalCharacters: string = "";

  for (let i = 0; i < upChartNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(upperCharList));
  }
  for (let i = 0; i < numNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(numberList));
  }
  for (let i = 0; i < symbolNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(symbolList));
  }
  for (let i = 0; i < lowCharNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(lowerCharList));
  }

  return finalCharacters
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};
