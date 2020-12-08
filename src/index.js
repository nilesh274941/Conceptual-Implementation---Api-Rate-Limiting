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
let count=0;
let timeoutId=null;
let max=20;
const setInitial=()=>{
	max=20;
	timeoutId=null;
	count=0;
//	console.log("----");
}
const sec=30;
app.get("/api/posts",async (req,res)=>{
	++count;
	let noOfPost=10;
	let gotMax=false;
	if(req.query.max!=null)
	{
		const m=Number(req.query.max);
		if(!isNaN(m))
		{
			noOfPost=m.toFixed(0);
			gotMax=true;
		}
	}
	if(gotMax)
	{
		if(noOfPost<max) max=noOfPost;
		else noOfPost=max;
	}
	if(count>5)
	{
		res.writeHead(429,{
			"content-type": "application/json"
		});
		res.write(JSON.stringify({message: "Exceed Number of API Calls"}));
	}
	else {
		const postsToSend=[...posts];
		postsToSend.splice(noOfPost,posts.length-noOfPost);
//		console.log(noOfPost,max);
		res.json(postsToSend);
	}
	if(timeoutId==null) {
		timeoutId=setTimeout(setInitial,sec*1000);
	}
	res.end();
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
