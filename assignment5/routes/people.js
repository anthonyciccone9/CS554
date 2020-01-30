const express = require('express');
const router = express.Router();
const bluebird = require("bluebird");
const redis = require('redis');
const redisc = redis.createClient();
const axios = require("axios");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let recent = [];

const getPeople = async () =>{
  const {data} = await axios.get(
  "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json"
);
  return data;
}

router.get("/api/people/history", async function (req,res){
  var people = [];
  for(var x = 0; x < recent.length && x < 20; x++){
    people.push(await redisc.getAsync(recent[x]));
  }
  res.send(people);
})

router.get("/api/people/:id", async function (req,res) {
  const id = req.params.id;
  const cache = await redisc.getAsync(id);
  const foo = await getPeople();

  if(cache){
    res.json({person: JSON.parse(cache)});
    recent.unshift(id);
  }else{
    try{
      let person = foo[id - 1];
      console.log(person);
      res.json({person});
      recent.unshift(id);
      let cache = await redisc.setAsync(id, JSON.stringify(person));
    }catch (e) {
      res.status(404).json({e: "ID given is invalid"});
    }
  }
})

module.exports = router;
