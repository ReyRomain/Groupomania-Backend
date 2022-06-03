
const {emailExists} = require("./models/usersModels");
console.log(emailExists({email:"test@test.com"}));