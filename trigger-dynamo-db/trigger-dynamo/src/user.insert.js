const uuid = require('uuid')
const Joi = require('@hapi/joi')
const decoratorValidator = require('./util/decoratorValidator')
const globalEnum = require('./util/gloablEnum')

class Handler{

    constructor({ dynamoDbSvc }){
        this.dynamoDbSvc = dynamoDbSvc
        this.dynamodbTable = process.env.DYNAMODB_TABLE
    }

    static validator(){
        return Joi.object({
            name: Joi.string().max(100).min(2).required(),
            email: Joi.string().max(100).min(2).required(),
        })
    }

    prepareData(data){
        const params = {
            TableName: this.dynamodbTable,
            Item: {
                ...data,
                id: uuid.v1(),
                createdAt: new Date().toISOString()
            }
        }

        return params
    }

    async insertItem(params){
        return this.dynamoDbSvc.put(params).promise()
    }

    handleSucess(data){
        const response = {
            statusCode: 200,
            body: JSON.stringify(data)
        }

        return response
    }

    handleError(data){
        const response = {
            statusCode: data.statusCode || 501,
            headers: { 'Content-Type': 'text/plain'},
            body: 'Error'
        }

        return response
    }

    async main(event){
        try{

            //antigo
            // const data = JSON.parse(event.body)
            // const dbParms = this.prepareData(data)

            // /////validacao de obj
            // const  { error, value } = await Handler.validator().validate(data)

            /////validacao de obj

            const data = event.body
            const dbParams = this.prepareData(data)

            await this.insertItem(dbParams)

            return this.handleSucess(dbParams.Item)





            await this.insertItem(dbParms)

            return this.handleSucess(dbParms.Item)

        }catch(error){
            console.log(error.stack)
            return this.handleError({ statusCode: 500 })

        }
    }
}
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
    dynamoDbSvc: dynamoDB
})
module.exports = decoratorValidator(
                    handler.main.bind(handler),
                    Handler.validator(),
                    globalEnum.ARG_TYPE.BODY)