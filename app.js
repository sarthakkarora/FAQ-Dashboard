const express = require("express")
const app=express()
const cors = require('cors')
const mongoose = require("mongoose")
const userRoutes = require("./ROUTES/userRoutes")
const queryRouter = require("./ROUTES/userqueries")

app.use(cors({
  origin: 'http://localhost:3000', 
}));

//app.use(express.static(path.join(__dirname, 'client/build')));


mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use(userRoutes);
app.use(queryRouter);


app.listen(5000, () => {
    console.log("Server is running on port 3000");
});

