const getRandomString = () : string => {
  return Math.floor((Math.random() * 10000000)).toString(36);
};

export default getRandomString;
