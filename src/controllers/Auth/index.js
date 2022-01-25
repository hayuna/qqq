import { Console, isRU } from "../../utils.js"

const Auth = {
    async login() {
        Console.log('1. Log in user')
        body.userKey = body.userKey || process.env.USER_KEY
        if (!body.userKey) throw new Error(`❌ Cannot find userKey. Please make one of these changes:\n1. Specified it in request as userKey.\n2. Add key USER_KEY to .env file.`)

        body.secret = body.secret || process.env.SECRET
        if (!body.secret) throw new Error(`❌ Cannot find secret. Please make one of these changes:\n1. Specified it in request as secret.\n2. Add key SECRET to .env file`)

        if (isRU()) {
            body.userKeyRU = body.userKeyRU || process.env.USER_KEY_RU
            if (!body.userKeyRU) throw new Error(`❌ Cannot find userKeyRU. Please make one of these changes:\n1. Specified it in request as userKeyRU.\n2. Add key USER_KEY_RU to .env file.`)

            body.secretRU = body.secretRU || process.env.SECRET_RU
            if (!body.secretRU) throw new Error(`❌ Cannot find secretRU. Please make one of these changes:\n1. Specified it in request as secretRU.\n2. Add key SECRET_RU to .env file`)
        }
    }
}

export default Auth