const express = require('express');
const app = express();

app.use(express.static('public'));

app.use("*", (req,res) => {
    res.status(404).json({error: "Page not Found"});
});

app.listen(3000, () => {
    console.log("Server is running on localhost:3000")
})
