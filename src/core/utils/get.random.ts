type getRandomInteger = ({ min, max }: { min: number; max: number }) => number;
type getRandomArrayItem = (array: any[]) => any;

export const getRandomInteger: getRandomInteger = ({ min, max }) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem: getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
