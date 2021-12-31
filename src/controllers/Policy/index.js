import FormData from "form-data";
import { api } from "../../api.js";

const Policy = {
    async setEmailVerification() {
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

        const response = await api(data, '/accounts.setPolicies')
        return response
    },
}

export default Policy