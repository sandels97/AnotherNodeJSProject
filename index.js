const express = require("express");
const morgan = require("morgan");
const validator = require("./query_validator.js")
const error_handler = require("./error_handler.js")

const app = express()
const port = 3000

app.use("/", express.static('public'))
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(validator.validateQuery)
app.get("/weather", function (req, res) {	
	res.setHeader('Content-Type', 'application/json');
	res.send({ msg: "Weather app!"});
})

app.use(error_handler.errorHandler)

app.listen(port, () => 
console.log(`Express app listening on port ${port}!`))
