import express from "express";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";
import path from "node:path";
import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';
dotenv.config();

const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "search.html"));
});

app.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "games.html"));
});

app.get("/log", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "changelog.html"));
});

app.get("/apps", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "apps.html"));
});

app.get("/go", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "go.html"));
});

//--ADMIN LOGIN SYSTEM STARTS HERE--//
var adminPassword = "testing123"; //Change this to the password you want to have. If you want it to be hidden, you can set this to an environment variable.

app.get("/admin", (req, res) => {
	var cookies = req.cookies; //The users cookies which we'll use to check if the user has the password cookie
	
	//If the password cookie doesn't exist, bring to login page
	if(!cookies.adminAuth) {
		res.sendFile(path.join(__dirname, "src", "adminLogin.html")); //Send to login page
		return; //End function
	}

	//If the password cookie exists, and it's correct, bring to the secret admin page and delete the password cookie so they have to log in next time. If not, bring to login page.
	if(cookies.adminAuth && cookies.adminAuth == adminPassword) {
		res.sendFile(path.join(__dirname, "src", "admin.html")); //Show admin page
		res.cookie('adminAuth', ''); //Reset password cookie
		return; //End function
	}else{
		res.sendFile(path.join(__dirname, "src", "adminLogin.html")); //Bring to login page
		return; //End function
	}
});

//An API to check if password is correct
app.get('/adminLoginValid', function(req, res){
	if(req.query.password && req.query.password == adminPassword) {
		res.send('true'); //Send true because the password's correct
	}else{
		res.send('false'); //Send false because the password's wrong
	}
});
//--ADMIN LOGIN SYSTEM ENDS HERE--//


app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "chat.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "settings.html"));
});

app.get("/donate", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "donate.html"));
});

app.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "404.html"));
});

app.get("*", (req, res) => {
  res.redirect("/404");
});

// Bare Server
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Cosmic running at http://localhost:${process.env.PORT}`);
});

server.listen({
  port: process.env.PORT,
});
