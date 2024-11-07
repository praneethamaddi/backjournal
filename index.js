const express = require("express");
const path = require("path");  // Add path module
const { User } = require("./models/mongo");
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to render advice template
app.get('/advice', (req, res) => {
    res.render('advice.ejs'); 
});

// Route to render the login form
app.get("/login", (req, res) => {
    res.render("login", { error: null });  // Pass error as null on initial load
});

// Route to handle login form submission
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "No user found with that email." });
        }

        if (user.password !== password) {
            return res.render("login", { error: "Invalid password." });
        }

        console.log("Login successful");
        res.redirect("/home");
    } catch (error) {
        console.error("Error during login:", error);
        res.render("login", { error: "An error occurred. Please try again." });
    }
});

// Route to render the home page (dashboard)
app.get("/home", (req, res) => {
    res.render("home");  // Renders home.ejs (Dashboard)
});

// Route to render the signup form
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });  // Pass error as null when rendering the form
});

// Route to handle signup form submission
app.post("/signup", async (req, res) => {
    const { user_name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.render("signup", { error: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "Email is already in use." });
        }

        const newUser = new User({ user_name, email, password });
        await newUser.save();

        console.log("User registered successfully");
        res.redirect("/login");
    } catch (error) {
        console.error("Error during user registration:", error);
        res.render("signup", { error: "An error occurred. Please try again." });
    }
});

// Route to render the Tasks page
app.get("/tasks", (req, res) => {
    res.render("tasks");  // Renders tasks.ejs
});

// Route to render the Notes page
app.get("/notes", (req, res) => {
    res.render("notes");  // Renders notes.ejs
});

// Route to handle logout
app.get("/logout", (req, res) => {
    // Logic to handle logout (clear session or authentication)
    res.redirect("/login");  // Redirect to login page after logout
});

app.listen(4000, () => {
    console.log("Server Started");
});
