import dotenv from 'dotenv'

dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT  
    },
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

    }
   
}