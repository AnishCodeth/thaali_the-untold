var nodemailer = require('nodemailer');
const {google}=require('googleapis');
const customError = require('./customerror');

const client_id='962289731781-co5fo5fslf29qvctgsdp2uab1ft06303.apps.googleusercontent.com'
const client_secret='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'
const redirect_uri='https://developers.google.com/oauthplayground'
const refresh_Token='1//04g0PywSTu3iyCgYIARAAGAQSNwF-L9Irhitg0qfo72E0OxU-qqNPrrWNZE8HLRVaCGP3zQK67l6R1QbNa_yZOeZ8xDna8gIAWnU'
require('dotenv').config()

// const emailVerification=async (gmail_id,code)=>{
// return new Promise(async (resolve,reject)=>{
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL,
//     pass: process.env.PASSWORD
//   }
// });

// var mailOptions = {
//   from: process.env.GMAIL,
//   to: gmail_id,
//   subject: 'Verification code',
//   html: `<h1>${code}</h1>`  //write here javascript code for verification
// };

// try{
// await transporter.sendMail(mailOptions)
// resolve('email sent')
// }
// catch(err)
// {
// reject(err)
// }
// })
// }
// module.exports=emailVerification


const oAuth2Client=new google.auth.OAuth2(client_id,client_secret,redirect_uri)
oAuth2Client.setCredentials({refresh_token:refresh_Token})

async function sendmail(gmail_id,code,next)
{
    try{
const accessToken=await oAuth2Client.getAccessToken()
const transport=nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:'khalti499@gmail.com',
            clientId:client_id,
            clientSecret:client_secret,
            refreshToken:refresh_Token,
            accessToken:accessToken
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
        console.log(error)
        throw new customError(error)
    }
}

module.exports={sendmail}