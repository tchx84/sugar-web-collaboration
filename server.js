/*
 * Copyright (C) 2014 Martin Abente Lahaye - martin.abente.lahaye@gmail.com.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301
 * USA
 */

var app = require("http").createServer();
var io = require("socket.io")(app);

var users = {};
var lobby = io.of('/lobby');
lobby.on("connection", function(socket){
  console.log("user joined");

  var user = {};
  user.id= socket.id;
  user.name = "anonymous";
  user.colors = ["#2F2B28","#4D444B"];
  user.services = {};

  users[socket.id] = user;

  socket.on("update", function(properties){
    console.log("user updated");

    if ("name" in properties){
      user.name = properties.name;
    }
    if ("colors" in properties){
      user.color = properties.color;
    }

    socket.broadcast.emit("updated", user);
  });

  socket.on("publish", function(service){
    user.services.push(service);
    socket.broadcast.emit("published", socket.id, service);
  });

  socket.on("forget", function(service){
    user.services.remove(service);
    socket.broadcast.emit("forgot", socket.id, service);
  });

  socket.on("disconnect", function(){
    console.log("user left");
    delete users[socket.id];
    socket.broadcast.emit("left", socket.id);
  });

  socket.emit("connected", users);
  socket.broadcast.emit("joined", user);
});


rooms = io.of("/rooms");
rooms.on("connection", function(socket){
  console.log("user joined rooms");

  var room = "";

  socket.on("send", function (message){
    if (room == ""){
       console.log("not in a room yet");
       return;
    }

    console.log("send");
    rooms.to(room).emit("broadcast", message);
  });

  socket.on("join", function(_room){
     if (room != ""){
       console.log("already in a room");
       return;
     }

     console.log("join");
     room = _room;
     socket.join(room);
     rooms.to(room).emit("joined");
  });
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});
