
# Gigya Site Provisioner

Tool for create new sites in Gigya Console and copy configuration


## Usage

Clone the project

```bash
  git clone https://code.roche.com/gigya-team/site-provisioner.git
```

Go to the project directory

```bash
  cd site-provisioner
```

Install dependencies

```bash
  npm install
```

Start the server

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
| `dataCenter` | `string` | Yes | Available values (EN, US, CH, RU) |
| `countryCode` | `string(10)` | Yes |  |
| `language` | `string(5) or array of string(5)` | Yes |  |
| `system` | `string(10)` | Yes |  |
| `purpose` | `string(15)` | No |  |
| `userKey` | `string` | Yes |  |
| `secret` | `string` | Yes |  |
#### Responses
##### SUCCESS
```json
{
  "message" : string
}
```
##### FAIL
```json
{
  "invalidValues": [string],
  "incorrectParameters": [string]
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

## Test Coverage (88.89%)

