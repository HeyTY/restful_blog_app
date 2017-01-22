var bodyParser  = require("body-parser"),
methodOverride	= require("method-override"),
express 		= require("express"),
mongoose    	= require("mongoose"),
app 	    	= express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
// 	title: "First Post",
// 	image: "https://unsplash.com/?photo=cFplR9ZGnAk",
// 	body: "Hello World"
// });

// RESTFUL ROUTES


app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log("ERROR");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
	// create blog
	Blog.create(req.body.blog, function(err, newBLog){
		if (err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	})
});


// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("show",{blog: foundBlog});
		}
	});
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if (err){
			res.redirect("/blogs");
		} else{
			res.render("edit", {blog: foundBlog});
		}
	});
});


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});

});

// REDIRECT WRONG PAGE

app.get("/*", function(req, res){
	res.send("ERROR PAGE NOT FOUND");
});

// DEPLOY SERVER
app.listen(3000, function(){
	console.log("Server Deployed!");
});

