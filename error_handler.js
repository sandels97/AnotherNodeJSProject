const errorHandler = (err, req, res, next) => {
    if(!err.statusCode || err.statusCode === 500) {
        res.status(500).send({ error: err.message}) //"Internal server error"
    } else {
        res.status(err.statusCode).send({ error: err.message})
    }
}

module.exports = {
	errorHandler
}