/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var Sequelize = require('sequelize');
var sequelize = new Sequelize("sequelizeTest", "root");
var request = require("request");

describe("Persistent Node Chat Server", function() {
  var Message;

  beforeEach(function() {
    Message = sequelize.define('messages', {
      username: Sequelize.STRING,
      message: Sequelize.STRING,
      roomname: { type: Sequelize.STRING, defaultValue: 'Main Room' }
    });
    Message.sync();
    
    /* TODO - You'll need to fill this out with your mysql username
     * and password. */

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    // TODO fill this out
    
  });

  afterEach(function() {
    Message.drop();
  });
             
  it("Should insert posted messages to the DB", function(done) {
    // Post a message to the node chat server:
    request({method: "POST",
             uri: "http://127.0.0.1:8080/classes/messages",
             form: {username: "Valjean",
                    message: "In mercy's name, three days is all I need."}
            },
            function(error, response, body) {
              /* Now if we look in the database, we should find the
              
               * posted message there. */
              if (error) throw error;
              Message.findAll().success(function(message){
                expect(message.length).toEqual(1);
                expect(message[0].username).toEqual("Valjean");
                expect(message[0].message).toEqual("In mercy's name, three days is all I need.");
                done();
              });
            });
  });

  xit("Should output all messages from the DB", function(done) {
    // Let's insert a message into the db

    Message.build({username: "Javert", message: "Men like you can never change!"}).save();
    Message.findAll().success(function(message){
      console.log("First message ", message[0].message);
    });

    request("http://127.0.0.1:8080/classes/messages",
      function(error, response, body) {
        if (error) throw error;
        console.log("result ", body);
        var messageLog = JSON.parse(body);
        console.log("Parse", messageLog);
        expect(messageLog[0].username).toEqual("Javert");
        expect(messageLog[0].message).toEqual("Men like you can never change!");
        done();
    });

  });
});
