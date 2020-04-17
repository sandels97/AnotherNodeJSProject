const validateQuery = (req, res, next) => {
    let observation = req.query.observation

    let validated = true
    
    if(observation != undefined) {
        
        let arr = observation
        for(let x = 0; x < arr.length; x++) {
            let value = arr[x]
            if(value != "wind" && value != "temperature" && value != "humidity") {
                const err = new Error(`Value ${value} is invalid`)
                err.statusCode = 400
                next(err)
                validated = false
                break
            }
        }
        
    }
    
    if(validated) {    
        console.log('LOGGED')
        next()
    }

}

module.exports = {
	validateQuery
}