# MODULE DOCTYPES (Typescript in the future can replace it)
## ACL
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
## Application
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
## Dataflow
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
## Google
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
## PermissionGroup
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
## Site
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
## WebSDK
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



