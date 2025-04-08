const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Dummy User Data (Normally, yeh database se aayega)
const users = [
    { id: 1, name: "Dibyaranjan Barik", email: "dibya@example.com" },
    { id: 2, name: "Rahul Kumar", email: "rahul@example.com" }
];

// API: Get All Users
app.get('/users', (req, res) => {
    res.json(users);
});

// API: Get User By ID
app.get('/users/:id', (req, res) => {
    console.log(req.params.id);
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    res.json(user);
});

// API: Add New User
app.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
