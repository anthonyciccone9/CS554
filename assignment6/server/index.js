// I plege my honor that I have abided by the Stevens Honor System. aciccone
const express = require("express");
const app = express();
const redisConnection = require("./../redis-connection");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const nrpSender = require("./nrp-sender-shim");

app.get("/api/people/:id", async (req,res) => {
  try{
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "get-person",
      data: {
        action: 'GET',
        id: req.params.id
      }
    });
    res.json(response);
  }catch(err){
    res.json({error: "error with GET"})
  }
});

app.post("/api/people/", async (req, res) => {
  try{
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "create-person",
      data: {
        action: 'POST',
        person: req.body
      }
    });
    res.json(response);
  }catch(error){
    res.json({error: "error with POST"})
  }
})

app.put('/api/people/:id', async (req,res) =>{
  try{
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "update-person",
      data: {
        action: 'PUT',
        id: req.params.id,
        person: req.body
      }
    })
    res.json(response);
  }catch(err){
    res.json({error: "error with PUT"});
  }
});

app.delete("/api/people/:id", async (req,res) => {
  try{
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "delete-person",
      data: {
        action: 'DELETE',
        id: req.params.id
      }
    });
    res.json(response);
  }catch(err){
    console.log(err);
    res.json("error with DELETE");
  }
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
