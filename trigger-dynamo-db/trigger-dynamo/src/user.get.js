const handler = {
    async main(event){
        try{
            return { 
                'statusCode' : 200,
                "body": "{\"name\": \"Joao\", \"email\": \"r.joao.ltda@gmail.com\"}"
            }
        }catch(error){
            return { 
                statusCode : 500,
                body: error.stack
                
        }

        }

        
    }
}

module.exports = handler.main.bind(handler)