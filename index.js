const express = require("express");
const morgan = require("morgan");
const validator = require("./query_validator.js")
const error_handler = require("./error_handler.js")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const app = express()
const port = 3000

const api_url = "https://www.ilmatieteenlaitos.fi/observation-data?station=101004"


app.use("/", express.static('public'))
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(validator.validateQuery)
app.get("/weather", function (req, res) {	
    
    let http = new XMLHttpRequest();

    http.open("GET", api_url, true);
    
    http.onload = function () {
        if (http.readyState === http.DONE) {
            if (http.status === 200) { 
                res.setHeader('Content-Type', 'application/json');
                res.send(parseData(parseQuery(req.query.observation), http.responseText));
            }
        }
    };
    
    http.send();
})

const parseQuery = (observation) => {
    let humidity = false
    let temperature = false
    let wind = false
    
    if(observation != undefined) {
        wind = observation.includes("wind")
        humidity = observation.includes("humidity")  
        temperature = observation.includes("temperature")
    } else {
        wind = true
        temperature = true
        humidity = true
    }
    
    return {"wind" : wind, "humidity" : humidity, "temperature" : temperature}
}

const parseData = (observationObject, jsonResponse) => {
    let json = JSON.parse(jsonResponse)
    let wind = json.WindDirection[0][1]
    let humidity = json.Humidity[0][1]
    let temperature = json.MaximumTemperature[0][1]
    
    let o = {}
    if(observationObject["wind"]) {
        o["wind"] = wind
    }
    if(observationObject["humidity"]) {
        o["humidity"] = humidity
    }
    if(observationObject["temperature"]) {
        o["temperature"] = temperature
    }
    return o
}

app.use(error_handler.errorHandler)

app.listen(port, () => 
console.log(`Express app listening on port ${port}!`))
