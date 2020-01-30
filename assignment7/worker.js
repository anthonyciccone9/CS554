const redisc = require("./redis-connection");

const key="12406729-2476c742a7b8ffa2dd5e16245";
const url = `https://pixabay.com/api/?key=${key}&q=`
var Request = require("request");

async function main(){
    redisc.on("get-image", (request,channel)=> {
        var query = request.query;
        if(query != undefined){
            var newQueryStr = query.split(' ').join('+');
            const fullURL = url + newQueryStr;
            Request.get(fullURL, (error, response, body) =>{
                if(error){
                    return console.dir(error);
                }
                if(JSON.parse(body).hits.length > 0){
                    const bestURL = JSON.parse(body).hits[0].previewURL;
                    const response = {
                        "username": request.username,
                        "imageURL": bestURL,
                        "message": request.message
                    };
                    redisc.emit("resp-data", {
                        response:response
                    });
                }
            });
        }
    });
}

main();
