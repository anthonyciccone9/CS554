// I pledge my honor that I have abided by the Stevens Honor System. aciccone
const redisConnection = require("./../redis-connection");
const axios = require("axios");

async function main(){
  try{
    const dummyData = "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
    const data = axios.get(dummyData).then(dat => dat.data);
    let people = await data;

    redisConnection.on("get-person:request:*", async (message, channel) => {
      const id = parseInt(message.data.id, 10);
      const person = people.find(person => person.id === id);
      let eventName = message.eventName;
      let successEvent = `${eventName}:success:${message.requestId}`;

      if(person != undefined){
        redisConnection.emit(successEvent, {
          requestID: message.requestId,
          data: person,
          eventName: eventName
        })
      }
    });

    redisConnection.on("create-person:request:*", async (message,channel) => {
            const size = people.length;
            const id = size + 1;
            const first_name = message.data.person.first_name;
            const last_name = message.data.person.last_name;
            const email = message.data.person.email;
            const gender = message.data.person.gender;
            const ip_address = message.data.person.ip_address;
            let newPerson= {};

            if(id && first_name && last_name && email && gender && ip_address){
                newPerson={
                    id: id,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    gender: gender,
                    ip_address: ip_address
                };
            }
            people.push(newPerson);
            let eventName = message.eventName;
            let successEvent = `${eventName}:success:${message.requestId}`;
            if(people.length >= size){
                redisConnection.emit(successEvent,{
                    requestId: message.requestId,
                    data: newPerson,
                    eventName: eventName
                });
            }
            else{
                throw error;
            }
        });

    redisConnection.on("update-person:request:*", async (message, channel) => {
      const id = parseInt(message.data.id, 10);
      var person = people.find(x => x.id === id);
      const newPerson = message.data.person;
      if(newPerson.first_name){
        person.first_name = newPerson.first_name;
      }
      if(newPerson.last_name){
        person.last_name = newPerson.last_name;
      }
      if(newPerson.email){
        person.email = newPerson.email;
      }
      if(newPerson.gender){
        person.gender = newPerson.gender;
      }
      if(newPerson.ip_address){
        person.ip_address = newPerson.ip_address;
      }

      people[id - 1] = person;
      let eventName = message.eventName;
      let successEvent = `${eventName}:success:${message.requestId}`;
      redisConnection.emit(successEvent,{
        requestId: message.requestId,
        data: newPerson,
        eventName: eventName
      });
    });

    redisConnection.on("delete-person:request:*", async (message, channel) => {
      const id = parseInt(message.data.id, 10);
      const delIndex = people.findIndex(x => x.id === id);
      let eventName = message.eventName;
      let successEvent = `${eventName}:success:${message.requestId}`;
      if(id >= people.length){
        throw error;
      }
      console.log(delIndex);
      if(delIndex >= 0){
        people.splice(id - 1, 1);
        redisConnection.emit(successEvent, {
          requestID: message.requestId,
          data: "successful deletion of id: " + id,
          eventName: eventName
        })
      }
    })

  }catch(err){
    console.log(err);
    console.error(err);
  }
}

main();
