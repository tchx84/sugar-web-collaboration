Sugar-Web Collaboration
=======================

This is a UGLY prototype to re-implement collaboration in Sugar web activities,
using socket.io.

Run it
------

```
git clone https://github.com/tchx84/sugar-web-collaboration.git
cd sugar-web-collaboration
npm install
node server.js
```

Use it
------

The server creates 2 endpoints, /lobby and /rooms, ie.,

```
http://yourserver:3000/lobby
http://yourserver:3000/rooms
```
