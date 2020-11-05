var express = require("express");
const databaseAccess = require("./databaseAccess");
var router = express.Router();
var database = require("./databaseAccess");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/listAllUsers", processAllUsers);
router.get("/listAllClasses", listAllClasses);

module.exports = router;

async function processAllUsers(req, res) {
  // For the purposes of the example, I'll assume there's a reason the database has a split between
  // first name and last name fields and the two results have to be joined in Node--I can't just pull from the database
  // in a more efficient manner like:
  // SELECT id, name, last FROM users;
  // ...which I think is probably the point of the exercise.

  // Grab users and last names
  let users = await database.getUsers();
  let lastNames = await database.getLastNames();

  // Create a new array called 'results' by mapping the existing users array
  var results = users.map(function (user) {
    // use Object.assign to get a dictionary merged with results from lastNames based on the ID field
    // This assumes every user and lastName has a corresponding ID
    return Object.assign(user, lastNames.find(function(lastName) {
      return user.id === lastName.id
    }))
  });

  // Return the newly built array of user dictionaries containing an ID, a name, and a last field.
  // I'm assuming there are clients dependent on the API, so we can't
  res.json(results);
}

function createLastNameLookup(array) {
  const returnValue = {};
  for (let i = 0; i < array.length; i++) {
    const next = array[i];
    returnValue[next.id] = next.last;
  }
  return returnValue;
}

async function listAllClasses(req, res) {
  res.json(await databaseAccess.getAllClasses());
}
