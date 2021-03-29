'use strict';

//const { promises: { readFile } } = require('fs')
const { get } = require('axios')

class Handler {

  constructor ({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
  }

  async detectImageLabels(buffer){
    const result = await this.rekoSvc.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise()

    const workItems = result.Labels
        .filter(({ Confidence }) =>  Confidence > 80)

    const names = workItems
        .map(({ Name }) => Name)
        .join(' and ')

    console.log(names)

    return { names , workItems }
  }

  async getImageBuffer(imageUrl){
    const response = await get(imageUrl, {
      responseType: 'arraybuffer'
    })

    const buffer = Buffer.from(response.data, 'base64')

    return buffer
  }


  async translateText(text){
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }

    const result = await this.translatorSvc
                            .translateText(params)
                            .promise()

    return result.TranslatedText
  }


  async main(event){
    try{
      // const imgBuffer = await readFile('./images/tiger.jpg')
      const { imageUrl } = event.queryStringParameters

      const buffer = await this.getImageBuffer(imageUrl)

      const { names, workItems } = await this.detectImageLabels(buffer)
      
      console.log({names,  workItems})

      const translated =  await this.translateText(names)

      return {
        statusCode: 200,
        body: translated
      }
      
    }catch(error){
      console.log(error)
      return {
        statusCode: 500,
        body: "Internal error"
      }
    }
  }
}

//factory
const aws = require('aws-sdk')
const reko = new aws.Rekognition()
const translator = new aws.Translate()
const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator
})
module.exports.main = handler.main.bind(handler)