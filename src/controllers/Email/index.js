import axios from 'axios'
import FormData from 'form-data'
import { api } from '../../api.js'
import { Console } from '../../utils.js'

const PROJECT_ID = '21943'

const generateBranch = () => {
    switch (environment.toLowerCase()) {
        case 'sandbox': return 'main'
        case 'dev': return 'dev'
        case 'test': return 'test'
        case 'prod': return 'main'
    }
}

const generateFileName = async (type, domainName, lang) => {
    // available languages are hardcoded on the front side and cannot retrieve them from API 
    const AVAILABLE_LANGUAGES = ['en', 'ar', 'bg', 'ca', 'zh-cn', 'zh-hk', 'zh-tw', 'hr', 'cs', 'da', 'nl', 'nl-inf', 'et-ee', 'fi', 'fr', 'fr-inf', 'de', 'de-inf', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lv-lv', 'lt-lt', 'ms', 'mr', 'no', 'fa', 'pl', 'pt', 'pt-br', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'es-inf', 'es-mx', 'sv', 'tl', 'th', 'tr', 'uk', 'vi']
    
    let language = lang
    if(!AVAILABLE_LANGUAGES.some(l => l === language)) {
        language = 'en'
    }

    const countryFullname = body.countryFullname.toLowerCase()

    const branch = generateBranch()
    const possibleFiles = [
        `/files/${encodeURIComponent(`${domainName}/${environment.toLowerCase()}_${type}_${countryFullname}_${language}.html`)}/raw?ref=${branch}`,
        // safety path when emails has no multilanguage
        `/files/${encodeURIComponent(`${domainName}/${environment.toLowerCase()}_${type}_${countryFullname}.html`)}/raw?ref=${branch}`,
        // safety path when emails has no country full name
        `/files/${encodeURIComponent(`${domainName}/${environment.toLowerCase()}_${type}.html`)}/raw?ref=${branch}`,
        // safety path when emails for country not exist yet
        `/files/${encodeURIComponent(`_blueprint/${environment.toLowerCase()}_${type}_blueprint.html`)}/raw?ref=${branch}`,
        `/files/${encodeURIComponent(`_blueprint/${environment.toLowerCase()}_${type}.html`)}/raw?ref=${branch}`,
        // safety path when sandbox
        `/files/${encodeURIComponent(`_blueprint/prod_${type}_blueprint.html`)}/raw?ref=main`,
        `/files/${encodeURIComponent(`_blueprint/prod_${type}.html`)}/raw?ref=main`,
    ]

    const responses = []
    for (const file of possibleFiles) {
        try {
            await axios(`https://code.roche.com/api/v4/projects/${PROJECT_ID}/repository${file}`, {
                headers: {
                    'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
                }
            })
            responses.push(file)
            break;
        } catch (e) {}
    }
    return responses
}

const retrieveEmailTemplate = async (emailTemplatePaths, emailTemplate) => {
    const url = emailTemplatePaths[emailTemplate]
    let response = null
    try{
        response = await axios(`https://code.roche.com/api/v4/projects/${PROJECT_ID}/repository${url}`, {
            headers: {
                'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
            }
        })
    }catch(e){}
    return response.data
}

const Email = {
    checkGitlabToken(){
        if (!process.env.GITLAB_TOKEN) {
            throw new Error(`❌ Cannot find GITLAB_TOKEN to retrieve Email Templates. Please add key GITLAB_TOKEN to .env file. Instruction how to retrieve it you can find here: 
            https://code.roche.com/gigya-team/site-provisioner/-/blob/master/README.md#get-gitlab_token-required-to-set-email-templates`)
        } else {
            Console.log('✅ GITLAB_TOKEN was set')
        }
    },
    async retrieve(domainName, lang){
        const [accountDeletionConfirmation] = await generateFileName('account_deletion_confirmation', domainName, lang)
        const [emailVerification] = await generateFileName('email_verification', domainName, lang)
        const [newUserWelcome] = await generateFileName('new_user_welcome', domainName, lang)
        const [passwordReset] = await generateFileName('password_reset', domainName, lang)
        const [passwordResetConfirmation] = await generateFileName('password_reset_confirmation', domainName, lang)
        
        const emailTemplatePaths = {
            accountDeletionConfirmation,
            emailVerification,
            newUserWelcome,
            passwordReset,
            passwordResetConfirmation
        }
    
        const accountDeletionConfirmationEmailTemplate = await retrieveEmailTemplate(emailTemplatePaths, 'accountDeletionConfirmation')
        const emailVerificationEmailTemplate = await retrieveEmailTemplate(emailTemplatePaths, 'emailVerification')
        const newUserWelcomeEmailTemplate = await retrieveEmailTemplate(emailTemplatePaths, 'newUserWelcome')
        const passwordResetEmailTemplate = await retrieveEmailTemplate(emailTemplatePaths, 'passwordReset')
        const passwordResetConfirmationEmailTemplate = await retrieveEmailTemplate(emailTemplatePaths, 'passwordResetConfirmation')

        return {
            accountDeletionConfirmationEmailTemplate,
            emailVerificationEmailTemplate,
            newUserWelcomeEmailTemplate,
            passwordResetEmailTemplate,
            passwordResetConfirmationEmailTemplate
        }
    },
    async setPasswordResetEmailTemplate(template, lang){
        Console.log('setting emails password reset')

        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('passwordReset', JSON.stringify({
            EmailTemplates: {
                [lang.toLowerCase()]: template
            },
            ResetURL: ''
        }))
        await api.accounts(data, '/accounts.policies.emailTemplates.setConfig', false, false)

        const data2 = new FormData()
        data2.append('apiKey', apiKey)
        data2.append('passwordReset', JSON.stringify({
            EmailTemplates: {
                [lang.toLowerCase()]: template
            },
            DefaultLanguage:lang.toLowerCase(),
            ResetURL: ''
        }))
        await api.accounts(data2, '/accounts.policies.emailTemplates.setConfig', false, false)
    },
    async setPasswordResetConfirmationEmailTemplate(template, lang){
        Console.log('setting emails password reset confirmation')

        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('emailNotifications', JSON.stringify({
            ConfirmationEmailTemplates: {
                [lang.toLowerCase()]: template
            },
            
        }))
        await api.accounts(data, '/accounts.policies.emailTemplates.setConfig', false, false)
        

        const data2 = new FormData()
        data2.append('apiKey', apiKey)
        data2.append('emailNotifications', JSON.stringify({
            ConfirmationEmailTemplates: {
                [lang.toLowerCase()]: template
            },
            ConfirmationEmailDefaultLanguage: lang.toLowerCase(),
        }))
        await api.accounts(data2, '/accounts.policies.emailTemplates.setConfig', false, false)
    },
    async setNewUserWelcomeEmailTemplate(template, lang){
        Console.log('setting emails new user welcome')

        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('emailNotifications', JSON.stringify({
            WelcomeEmailTemplates: {
                [lang.toLowerCase()]: template
            },
        }))
        await api.accounts(data, '/accounts.policies.emailTemplates.setConfig', false, false)
        

        const data2 = new FormData()
        data2.append('apiKey', apiKey)
        data2.append('emailNotifications', JSON.stringify({
            WelcomeEmailTemplates: {
                [lang.toLowerCase()]: template
            },
            WelcomeEmailDefaultLanguage: lang.toLowerCase()
        }))
        await api.accounts(data2, '/accounts.policies.emailTemplates.setConfig', false, false)

    },
    async setAccountDeletionEmailTemplate(template, lang){
        Console.log('setting emails account deletion')

        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('emailNotifications', JSON.stringify({
            AccountDeletedEmailTemplates: {
                [lang.toLowerCase()]: template
            },
        }))
        await api.accounts(data, '/accounts.policies.emailTemplates.setConfig', false, false)


        const data2 = new FormData()
        data2.append('apiKey', apiKey)
        data2.append('emailNotifications', JSON.stringify({
            AccountDeletedEmailTemplates: {
                [lang.toLowerCase()]: template
            },
            AccountDeletedEmailDefaultLanguage: lang.toLowerCase(),
        }))
        await api.accounts(data2, '/accounts.policies.emailTemplates.setConfig', false, false)
    },
    async setEmailVerificationEmailTemplate(template, lang){
        Console.log('setting emails verification')
        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('emailVerification', JSON.stringify({
            EmailTemplates: {
                [lang.toLowerCase()]: template
            },
        }))
        await api.accounts(data, '/accounts.policies.emailTemplates.setConfig', false, false)


        const data2 = new FormData()
        data2.append('apiKey', apiKey)
        data2.append('emailVerification', JSON.stringify({
            EmailTemplates: {
                [lang.toLowerCase()]: template
            },
            DefaultLanguage: lang.toLowerCase()
        }))
        await api.accounts(data2, '/accounts.policies.emailTemplates.setConfig', false, false)


    },
    async set(emails, lang){
        await this.setPasswordResetEmailTemplate(emails.passwordResetEmailTemplate, lang)
        await this.setPasswordResetConfirmationEmailTemplate(emails.passwordResetConfirmationEmailTemplate, lang)
        await this.setNewUserWelcomeEmailTemplate(emails.newUserWelcomeEmailTemplate, lang)
        await this.setAccountDeletionEmailTemplate(emails.accountDeletionConfirmationEmailTemplate, lang)
        await this.setEmailVerificationEmailTemplate(emails.emailVerificationEmailTemplate, lang)
        
        Console.log(`✅ Email Templates have been saved [${lang}]`)
    },
}

export default Email

