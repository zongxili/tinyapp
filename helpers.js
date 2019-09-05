const getUserByEmail = function(userEmail, database) {
  let arrValue = Object.values(database);
  for (let i = 0; i < arrValue.length; i++) {
    // console.log("TEST________", arrValue[i]["email"], userEmail)
    if (arrValue[i]["email"] === userEmail) {
      return arrValue[i];
    }
  }
  return null;
};

const generateRandomString = function() {
  let returnOutput = "";
  let charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    returnOutput += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return returnOutput;
};


module.exports = { getUserByEmail, generateRandomString };