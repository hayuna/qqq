import FormData from "form-data";
import { api } from "../../api.js";
import { Console, isRU } from "../../utils.js";

const Policy = {
    async setEmailVerification() {
        Console.log('11. Setting email verification config')
        const accountOptions = {
            verifyEmail: true,                  // Require email verification
            verifyProviderEmail: false,         // Require email verification after social login
            useCodeVerification: false          // Use code verification
        }
        const emailVerification = {
            // nextURL: '',                     // Customize redirection URL
            verificationEmailExpiration: 86400, // Customize verification link expiration time
            autoLogin: true                     // Automatically login users upon email verification
        }
        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('accountOptions', JSON.stringify(accountOptions))
        data.append('emailVerification', JSON.stringify(emailVerification))

        const response = await api.accounts(data, '/accounts.setPolicies', false, isRU())
        Console.log('___ ✅ Require email verification was enabled')
        Console.log('___ ✅ Require email verification after social login was disabled')
        Console.log('___ ✅ Customize verification link expiration time was set to 24h')
        Console.log('___ ✅ Automatically login users upon email verification enabled')
        return response
    },
}

export default Policy