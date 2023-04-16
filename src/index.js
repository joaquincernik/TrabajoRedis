
const express=require('express')
const app =express();
const axios= require('axios')
var config = {
    method: 'get',
    
    url: 'https://v3.football.api-sports.io/teams/statistics?season=2022&team=26&league=1',
    headers: {
      'x-rapidapi-key': '9cc153827987f31e672969d9f7fd3ce4',
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  };
const responseTime=require('response-time')

var redis=require('redis')
var client=redis.createClient()
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

app.use(responseTime())
app.get('/',async(req,res)=>{
    //api
    let existe = await client.exists('Argentina-copa-del-mundo-2022');
    if(existe!=0){
        console.log("Aprovechando REDIS!");
        let dataArgentina = await client.get('Argentina-copa-del-mundo-2022');
        res.json(dataArgentina)
    }
    else{
        axios(config)
        .then(async function (response) {
        JSON.stringify(response.data);
          res.json((response.data));
          console.log('GUARDANDO INFO EN REDIS');
          //var argentina = response.data
          //console.log(response.data.response);
         
         await client.set('Argentina-copa-del-mundo-2022', JSON.stringify(response.data))
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }
  
    
    console.log(existe);


    //await client.set('key', 'cass');
  /*  
    fixture=response.data.response.fixtures;
    goals=response.data.response.goals;
      await client.hSet('Argentina-copa-del-mundo-2022', {
          jugados: fixture.played.total,
          ganados: fixture.wins.total,
      empatados: fixture.draws.total,
      perdidos:fixture.loses.total,
      goles:goals,

        })*/



    
});
app.listen(3000);
console.log("Servidor levantado en el puerto 3000");