const handler = {
    async main(event){
        console.log({event})

        return { statusCode : 200 }
    }
}

module.exports = handler.main.bind(handler)