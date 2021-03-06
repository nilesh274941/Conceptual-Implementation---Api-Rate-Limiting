const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
app.use(express.urlencoded());
const posts=require('./initialData');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here
global.count=0;
global.timeoutId=null;
global.max=null;
const setInitial=()=>{
	global.max=null;
	global.timeoutId=null;
	global.count=0;
//	console.log("----");
}
const sec=30;
app.get("/api/posts",async (req,res)=>{
	++global.count;
	let noOfPost=10;
	let gotMax=false;
	if(req.query.max!=null)
	{
		const m=Number(req.query.max);
		if(!isNaN(m))
		{
			noOfPost=Number(m.toFixed(0));
			gotMax=true;
		}
	}
	if(gotMax)
	{
		if(global.max==null) {
			if(noOfPost<=20) global.max=noOfPost;
			else noOfPost=10;
		}
		else {
			if(noOfPost>20) noOfPost=10;
			else if(noOfPost>global.max) noOfPost=global.max;
		}
	}
	else {
		noOfPost=10;
	}
/*	if(gotMax)
	{
		if(noOfPost>20)
		{
			if(global.max>20) noOfPost=10;
			else noOfPost=global.max;			
		}
		else if(noOfPost<global.max){
			global.max=noOfPost;
		}
		else {
			noOfPost=global.max;
		}
	}
*/
	if(global.count>5)
	{
		res.writeHead(429,{
			"content-type": "application/json"
		});
		res.write(JSON.stringify({message: "Exceed Number of API Calls"}));
	}
	else {
		const postsToSend=[...posts];
		postsToSend.splice(noOfPost,posts.length-noOfPost);
	//	console.log(noOfPost,global.max);
		res.json(postsToSend);
	}
	if(global.timeoutId==null) {
		global.timeoutId=setTimeout(setInitial,sec*1000);
	}
	res.end();
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
