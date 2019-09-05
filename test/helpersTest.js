const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    console.log("user.id", user.id);
    assert.equal(expectedOutput, user.id);
    // done();
  });

  // check if the helper function returns undefined if entering an invalid email
  it('should return null with invalid email', function() {
    const outputResult = getUserByEmail("user@somethinghere.com", testUsers);

    const expectedOutput = null;
    assert.equal(expectedOutput, outputResult);
    // done();
  });
});