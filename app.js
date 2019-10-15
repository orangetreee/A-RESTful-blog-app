var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride =require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	port = process.env.PORT || 9000;

// title
// image
// body
// created(date)

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public")); // costume style sheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema)


// RESTful ROUTES
app.get("/", function(req, res) {
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, blogs) {
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
// 	create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog) {
		if(err) {
			// res.render("new");
			console.log(err);
		} else {
			// 	then redirect to idnex
			res.redirect("/blogs");
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
// 	detroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
// 	redirect to somewhere
});

app.listen(port, function() {
	console.log("YelpCamp Started!");
});

