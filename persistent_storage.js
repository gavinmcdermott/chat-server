var globals = require('./globals');
var Sequelize = require('sequelize');
var sequelize = new Sequelize("sequelizeTest", "root");

var Message = sequelize.define('messages', {
  username: Sequelize.STRING,
  message: Sequelize.STRING,
  roomname: { type: Sequelize.STRING, defaultValue: 'Main Room' }
});
Message.sync();//.success(function() {
//     Message.findAll().success(function(models) {
//       for (var i = 0; i < models.length; i++) {
//       }
//     });
// });

exports.getMessages = function(callback) {
  Message.findAll({order: 'createdAt DESC'}).success(function(messages){
    globals.messageLog = [];
    console.log("got messages from server")
    for (var i = 0; i < messages.length; i++) {
      callback(messages[i]);
    }
  });
};

exports.postMess = function(message){
  Message.build(message).save();
};