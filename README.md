# Gigya Site Provisioner

Tool for create new sites in Gigya Console and copy configuration

[[_TOC_]]

## Usage

### Clone the project

```bash
  git clone https://code.roche.com/gigya-team/site-provisioner.git
```

### Go to the project directory

```bash
  cd site-provisioner
```

### Install dependencies

```bash
  npm install
```

### Download credentials to Google Service Account

```bash
Go to Google Cloud Dashboard https://console.cloud.google.com/iam-admin/serviceaccounts/details/114462709147202613452/keys?project=gigya-epicx-program
Click ADD KEY
Choose New Key
Choose JSON
Click Create
Move downloaded file to src/controllers/Google/credentials.json
```

### Get private key to Google

```bash
Go to address https://code.roche.com/gigya-team/site-provisioner/-/settings/ci_cd
Expand section Variables
Find variable  GOOGLE_PRIVATE_KEY
Click on the pen icon
Copy Value
Move copied value to .env file GOOGLE_PRIVATE_KEY=`coppied value`
```

### Get GITLAB_TOKEN required to set Email Templates

```bash
Go to address https://code.roche.com/gigya-team/gigya-email-templates/-/settings/ci_cd
Expand section Variables
Find variable  GITLAB_TOKEN
Click on the pen icon
Copy Value
Move copied value to .env file GITLAB_TOKEN=`coppied value`
```

### Create .env file

```bash
If you want to avoid adding gigya userKey and secret inside request, you can create .env file in the root of project and provide these credentials in this file. Format of .env is inside .env.example
```

### Start the server

```bash
  npm run start
```

  
## Demo

[http://localhost:4000](http://localhost:4000)

  
## API Reference

#### Endpoint
```http
  POST /createSite
```
#### Parameters
| Name | Data Type | Required | Additional info |
| :--- | :--- | :--- | :--- |
| `dataCenter` | `string` | ✔ | Available values (EU, US) |
| `countryCode` | `string(10)` | ✔ |  |
| `language` | `string(5)` | ✔ | If more than 1 lang, separate using `,` without spaces. Last one will be default in Email Templates |
| `system` | `string(10)` | ✔ |  |
| `purpose` | `string` |  |  |
| `userKey` | `string` |  | Must be specified in request or .env file |
| `secret` | `string` |  | Must be specified in request or .env file |
| `multicountry` | `boolean` |  | Default `false`|
| `countryFullname` | `string` | ✔ |  |

#### Responses
##### SUCCESS
```json
{
  "message" : string
}
```
##### FAIL IN PARAMETERS
```json
{
  "invalidValues": [string],
  "incorrectParameters": [string]
}
```
##### FAIL IN RESPONSE
```json
{
  "message": string
}
```
The `message` attribute contains a message OK in case of success.

The `invalidValues` attribute describes validation errors.

The `incorrectParameters` attribute contains list of forbidden parameters.

#### Status Codes
| Status Code | Description |
| :--- | :--- |
| `200` | `OK` |
| `400` | `BAD REQUEST`|
| `404` | `NOT FOUND`|
| `500` | `INTERNAL SERVER ERROR`|

#### Flow between methods
<img src="/assets/flow.png" />
