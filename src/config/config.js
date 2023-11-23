import dotenv from 'dotenv'

dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT  
    },
    persistence: process.env.PERSISTENCE,
    mongo: {
         uri: process.env.MONGO_URI,
         dbname: process.env.MONGO_DB_NAME
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        githubSecret: process.env.GITHUB_CLIENT_SECRET,
        githubCallbackUrl: process.env.GITHUB_CALLBACK_URL

    },

    checkout: {
        checkoutUser: process.env.NODEMAILER_USER,
        checkoutPass: process.env.NODEMAILER_PASS,
        checkoutSmsSid: process.env.TWILIO_ACCOUNT_SID,
        checkoutSmsToken: process.env.TWILIO_AUTH_TOKEN,
        checkoutNumero: process.env.TWILIO_PHONE_NUMBER
    }
   
}