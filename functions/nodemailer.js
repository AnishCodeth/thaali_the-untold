const nodemailer=require('nodemailer')
const {google}=require('googleapis');
const customError = require('./customerror');
const { StatusCodes } = require('http-status-codes');

const client_id='962289731781-co5fo5fslf29qvctgsdp2uab1ft06303.apps.googleusercontent.com'
const client_secret='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'
const redirect_uri='https://developers.google.com/oauthplayground'
const refresh_Token="1//04XHFrlHIyhanCgYIARAAGAQSNwF-L9IrZMpfE9-MqgSeBvAHzyFoIgOo6MjJcUp_wQ4PD5kjSJsgIU-to-xSV6aXnl93zCcZnQw"
require('dotenv').config()

const oAuth2Client=new google.auth.OAuth2(client_id,client_secret,redirect_uri)

oAuth2Client.setCredentials({refresh_token:refresh_Token})

async function sendmail(gmail_id,code,next)
{
    try{
        console.log('inside the nodemAILER')
        const oAuth2Client=new google.auth.OAuth2(client_id,client_secret,redirect_uri)
oAuth2Client.setCredentials({refresh_token:refresh_Token})
const {token}=await oAuth2Client.getAccessToken()
const transport=nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:'khalti499@gmail.com',
            clientId:client_id,
            clientSecret:client_secret,
            refreshToken:refresh_Token,
            accessToken:token
        }
    }
)


const  mailOptions = {
        from: process.env.GMAIL,
        to: gmail_id,
        subject: 'Verification code',
        text:`${code}`,
        html: `<h1>${code}</h1>`  //write here javascript code for verification
      };
      const result=await transport.sendMail(mailOptions)
       return result;
    }
    catch(error){
        throw new customError(500,error)
    }
}

module.exports={sendmail}