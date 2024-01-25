import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import https from "https";
import dotenv from "dotenv";




const app=express();
const port=3000;
dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req,res)=>{
   const sendData={location:"Location", temp:"Temperature", description:"Description", feel:"Feel like",humidity:"Humidity", speed:"Speed"};
   res.render("index.ejs", {sendData:sendData})
});

app.post("/", async (req,res)=>{
    try {
    const location=await req.body.city;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=7740d25c3da07cf1c7df01e556fa81a5&units=metric`;
    const response=await axios.get(url);
    const weatherData=response.data;
    const temp= await weatherData.main.temp;
    const feelLike=weatherData.main.feels_like;
    const humidity=weatherData.main.humidity;
    const description= weatherData.weather[0].description;
    const windSpeed=weatherData.wind.speed;
    const sendData={};
    sendData.temp=temp;
    sendData.description=description;
    sendData.feel=feelLike;
    sendData.humidity=humidity;
    sendData.location=location;
    sendData.speed=windSpeed;

    res.render("index.ejs",{sendData:sendData, location:location, description:description, temp:temp });
    }
    catch(error){
        console.error("Error fetching weather data:", error);
        res.render("index.ejs", {sendData:{},error:"Error fetching weather data"});
    }
});



app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
});
