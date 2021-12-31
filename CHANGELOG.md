
# Change Log
All notable changes to this project will be documented in this file.
 
## [1.5.0] - IN-REVIEW
 
### Added
- 🛠 Added support for copying screensets
- 🛠 Added support for email verification policy
a) Require email verification
b) Require email verification after social login
c) Use code verification
d) Customize redirection URL
e) Customize verification link expiration time
f) Automatically login users upon email verification
- 🛠 Added support for SANDBOX in Google.GDrive and Google.GSheet
 
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
