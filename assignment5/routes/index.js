const path = require("path");
const people = require("./people");

const constructorMethod = (app) => {
    app.use("/", people);
};

module.exports = constructorMethod;
