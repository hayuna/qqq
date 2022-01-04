import { Console } from "../../utils.js"

const Auth = {
    async login() {
        Console.log('1. Log in user')
        body.userKey = body.userKey || process.env.USER_KEY
        if (!body.userKey) throw new Error(`❌ Cannot find userKey. Please make one of these changes:\n1. Specified it in request as userKey.\n2. Add key USER_KEY to .env file.`)

        body.secret = body.secret || process.env.SECRET
        if (!body.secret) throw new Error(`❌ Cannot find secret. Please make one of these changes:\n1. Specified it in request as secret.\n2. Add key SECRET to .env file`)
    }
}

export default Auth