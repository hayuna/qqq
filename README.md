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

Download credentials to Google Service Account

```bash
Go to Google Cloud Dashboard https://console.cloud.google.com/iam-admin/serviceaccounts/details/114462709147202613452/keys?project=gigya-epicx-program
Click ADD KEY
Choose New Key
Choose JSON
Click Create
Move downloaded file to src/controllers/Google/credentials.json
```

Optional step

```bash
If you want to avoid adding gigya userKey and secret inside request, you can create .env file in the root of project and provide these credentials in this file. Format of .env is inside .env.example
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
| `dataCenter` | `string` | Yes | Available values (EU, US, CN, RU) |
| `countryCode` | `string(10)` | Yes |  |
| `language` | `string(5) or array of string(5)` | Yes |  |
| `system` | `string(10)` | Yes |  |
| `purpose` | `string(15)` | No |  |
| `userKey` | `string` | Yes |  |
| `secret` | `string` | Yes |  |
| `multicountry` | `boolean` | No | Default `false`|
| `countryFullname` | `string` | Yes |  |

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

#### MODULE DOCTYPES (Typescript in the future can replace it)
##### ACL
- getAll
  ```yaml
  params: EMPTY
  response: [] // TO CHECK
  ```
- get
  ```yaml
  params: {
    aclId: string;
    fromMaster: boolean;
  }
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    acl: {
      _api: {};
      _data: {};
      _inherit: string[];
    },
    name: string;
  }
  ```
- setAll
  ```yaml
  params: EMPTY
  response: [null,null,null,null] // TO CHECK
  ```
- set
  ```yaml
  params: {
    aclId: string;
  }
  response: {} // TO CHECK
  ```
- compareACLs
  ```yaml
  params: {
    masterACL: {
      _api: {};
      _data: {};
      _inherit: string[];
    };
    environmentACL: {
      _api: {};
      _data: {};
      _inherit: string[];
    };
  }
  response: boolean;
  ```
##### Application
- create
  ```yaml
  params: {
    siteName: string;
  }
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    user: {
      userKey: string;
      userSecret: string;
      name: string;
      keyType: string;
      ownerPartnerId: number;
    };
    privateRsaPEM: string;
    publicRsaPEM: string;
    privatePkcs8PemEncodedRsa: string;
    publicPkcs8PemEncodedRsa: string;
    privatePkcs1PemEncodedRsa: string;
    publicPkcs1PemEncodedRsa: string;
  }
  ```
- assignToGroup 
  ```yaml
  params: {
    application: {
      userKey: string;
      userSecret: string;
      name: string;
      keyType: string;
      ownerPartnerId: number;
    }
  }
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    name: string;
  }
  ```
- generateCreationDate
  ```yaml
  params: EMPTY
  response: string;
  ```
##### Dataflow
- replaceVariables
  ```yaml
  params: {
    template: string;
  }
  response: string;
  ```
- create
  ```yaml
  params: {
    template: string;
  }
  response: {
    name: string;
    steps: Array;
    description: string;
  };
  ```
- setScheduleInit
  ```yaml
  params: {
    dataflowId: string;
  };
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    id: string;
  }
  ```
- setSchedule
  ```yaml
  params: {
    dataflowId: string;
  };
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    id: string;
  }
  ```
- getAll
  ```yaml
  params: EMPTY
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    resultCount: number;
    totalCount: number;
    result: Array<{
      apiKey: string;
      siteId: number;
      id: string;
      name: string;
      description: string;
      steps: Array;
      createTime: string;
      updateTime: string;
      updatedByEmail: string;
    }>
  }
  ```
##### Google
- GDrive.createFolder
  ```yaml
  params: {
    name: string;
    parent: string;
  }
  response: {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
    teamDriveId: string;
    driveId: string;
  }
  ```
- GDrive.renameAndMoveFile
  ```yaml
  params: {
    fileId: string;
    newName: string;
    parent: string;
  }
  response: {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
    teamDriveId: string;
    driveId: string;
  }
  ```
- GDrive.makeACopy
  ```yaml
  params: {
    fileId: string;
  }
  response: {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
    teamDriveId: string;
    driveId: string;
  }
  ```
- GSheet.getProtectedRangeIds
  ```yaml
  params: {
    fileId: string;
  }
  response: number[]
  ```
- GSheet.addPermissionsToProtectedCells
  ```yaml
  params: {
    fileId: string;
    emails: string[]
  }
  response: {
    spreadsheetId: string;
    replies: Array<{}>
  }
  ```
- GSheet.replaceCells
  ```yaml
  params: {
    fileId: string;
    country: {
      fullname: string;
      ISOCode: string;
    }
  }
  response: {
    [key:string]: {
      spreadsheetId: string;
      updatedRange: string;
      updatedRows: number;
      updatedColumns: number;
      updatedCells: number;
    };
  }
  ```
- GSheet.addSheetToList
  ```yaml
  params: {
    fileId: string;
    country: {
      fullname: string;
      ISOCode: string;
    }
  }
  response: {
    spreadsheetId: string;
    tableRange: string;
    updates: {
      spreadsheetId: string;
      updatedRange: string;
      updatedRows: number;
      updatedColumns: number;
      updatedCells: number;
    }
  }
  ```
- GSheet.getDevelopers
  ```yaml
  params: EMPTY
  response: string[]
  ```
##### PermissionGroup
- create
  ```yaml
  params: {
    application: {
      callId: string;
      errorCode: number;
      apiVersion: number;
      statusCode: number;
      statusReason: string;
      time: string;
      user: {
        userKey: string;
        userSecret: string;
        name: string;
        keyType: string;
        ownerPartnerId: number;
      };
      privateRsaPEM: string;
      publicRsaPEM: string;
      privatePkcs8PemEncodedRsa: string;
      publicPkcs8PemEncodedRsa: string;
      privatePkcs1PemEncodedRsa: string;
      publicPkcs1PemEncodedRsa: string;
    };
    domainName: string;
    ACLs: {
      [key: string]: {
        callId: string;
        errorCode: number;
        apiVersion: number;
        statusCode: number;
        statusReason: string;
        time: string;
        acl: {
          _api: {};
          _data: {};
          _inherit: string[]
        }
        name: string;
      }
    };
  }
  response: {
    callId: string;
    errorCode: number;
    apiVersion: number;
    statusCode: number;
    statusReason: string;
    time: string;
    name: string;
  }
  ```
- generatePermissionGroupName
  ```yaml
  params: {
    domainName: string;
    system: string;
  }
  response: string;
  ```
##### Site
- create
  ```yaml
  params: {
    siteName: string;
  };
  response: {
    statusCode: numberl
    errorCode: number;
    statusReason: string;
    callId: string;
    time: string;
    apiKey: string;
  }
  ```
- connectWithParent
  ```yaml
  response: {
    statusCode: numberl
    errorCode: number;
    statusReason: string;
    callId: string;
    time: string;
  }
  ```
- generateName
  ```yaml
  params: EMPTY
  response: string;
  ```
##### WebSDK
- get
  ```yaml
  params: EMPTY
  response: {
    statusCode: number;
    errorCode: number;
    statusReason: string;
    callId: string;
    time: string;
    baseDomain: string;
    siteGroupOwner: string;
    dataCenter: string;
    trustedSiteURLs: string[];
    tags: Array;
    description: string;
    captchaProvider: string;
    settings: {
      CNAME: string;
      shortURLDomain: string;
      shortURLRedirMethod: strinh;
      encryptPII: boolean;
    };
    urlShorteners: {
      bitly: {};
    };
    enableDataSharing: boolean;
    isCDP: boolean;
    globalConf: string;
    invisibleRecaptcha: {
      siteKey: string;
      secret: string;
    }
    recaptchaV2: {
      siteKey: string;
      secret: string;
    }
    funCaptcha: {
      siteKey: string;
      secret: string;
    }
  }
  ```
- set
  ```yaml
  params: {
    masterWebSDK: string;
  }
  response: {
    statusCode: number;
    errorCode: number;
    statusReason: string;
    callId: string;
    time: string;
  }
  ```
- replaceVariablesInWebSDK
  ```yaml
  params: {
    webSDK: string;
  }
  response: string;
  ```



