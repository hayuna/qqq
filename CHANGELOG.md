# Change Log
All notable changes to this project will be documented in this file.

## [1.10.0] - IN PROGRESS

### Added
- 🛠 Added support for flag to turn on/off GDrive stuff
- 🛠 Store Google privatekey in repository secrets to avoid downloading whole json with credentials (in the future credentials.json will be deprecated)

### Fixed
- 🐛 Fix Email Templates support

## [1.9.0] - 2022-03-03

### Added
- 🛠 Added support for social media configuration (for non prod env)
- 🛠 Added support for R4 & R5 test environment

## [1.8.0] - 2022-02-22

### Added
- 🛠 Added support for setting token expiration for reset password

## [1.7.0] - 2022-02-22

### Added
- 🛠 Added support for copying Email Templates from gitlab repository

### Changed
- ♻️ Change format of language in request. Array is not supported yet. You should use string separated by comma to support more than one language

## [1.6.0] - 2022-01-25

### Added
- 🛠 Added support for Russia partner

### Changed
- ♻️ Replace API methods into one main with submethods API.socialize(), API.admin(), API.accounts()
## [1.5.0] - 2022-01-04
 
### Added
- 🛠 Added support for copying screensets
- 🛠 Added support for email verification policy (Require email verification, Require email verification after social login, Use code verification, Customize redirection URL, Customize verification link expiration time, Automatically login users upon email verification)
- 🛠 Added support for SANDBOX in Google.GDrive and Google.GSheet
- 🛠 Added walidation for existing Google credentials file
 
### Changed
- 📚 Separated TYPES with README

### Fixed
- 🐛 Fixed lodash dependencies in GSheet
 
## [1.4.0] - 2021-12-30
  
### Added
- 🛠 Added process flow to README
- 🛠 Added support for .env file
- 🛠 Added support for Google.GDrive and Google.GSheet (only for not SANDBOX environment)
- 🛠 Added parameter to request: countryFullname
- 🛠 Added validation for duplicate names of site, application, permission group
- 📚 Update README with request/response types

### Changed
- ♻️ Changed structure of directories
- ♻️ Changed standard way of log into fancy colored one
- 🛠 Changed mandatoriness of userKey and secret in request into optional (now we can specify credentials inside .env file)
- ♻️ Changed some logs into more readable
  
### Fixed
- 🐛 Bugfix with default tab in GSheet
 
## [1.3.0] - 2021-12-20
  
### Fixed
- 🐛 Fixed ENV variable in url to rochesGigya inside WebSDK
 
## [1.2.0] - 2021-12-17
  
### Added
- 🛠 Added support for multicountry in WebSDK

### Fixed
- 🐛 Fixed incorrect replacement for SECRET_KEY inside ETLs
- 🐛 Fixed incorrect capitalize for COUNTRY_CODE and MULTI_COUNTRY inside WebSDK
- 🐛 Fixed incorrect capitalize for ENV inside WebSDK
 

## [1.1.0] - 2021-12-14
  
### Added
- 🛠 Added support for Dataflows

### Changed
- ♻️ Added environment and body to global scope
 
## [1.0.0] - 2021-06-22
- 🔖 First version of application released
