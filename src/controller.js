import Dataflow from './controllers/Dataflow/index.js'
import Application from './controllers/Application/index.js'
import ACL from './controllers/ACL/index.js'
import WebSDK from './controllers/WebSDK/index.js'
import PermissionGroup from './controllers/PermissionGroup/index.js'
import Site from './controllers/Site/index.js'
import Google from './controllers/Google/index.js'
import Auth from './controllers/Auth/index.js'
import { Console } from './utils.js'
import dotenv from 'dotenv'
import Policy from './controllers/Policy/index.js'
import Screenset from './controllers/Screenset/index.js'

dotenv.config()

export const createSite = async (req, res) => {
  try {
    global.body = req.body

    await Auth.login()

    await create('SANDBOX')
    // await create('DEV')
    // await create('TEST')
    // await create('PROD')
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    Console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const create = async (environment) => {
  global.environment = environment
  const domainName = Site.generateName();

  // validation for duplicated names
  await Site.isNameAvailable(domainName)
  await Application.isNameAvailable(domainName)
  await PermissionGroup.isNameAvailable(domainName)
  await Google.GDrive.checkCredentials()

  const site = await Site.create(domainName)
  global.apiKey = site.apiKey
  await Site.connectWithParent()

  const screensets = await Screenset.getAll()
  await Screenset.set(screensets)

  await Policy.setEmailVerification()

  const masterWebSDK = await WebSDK.get()
  await WebSDK.set(masterWebSDK.globalConf)

  const ACLs = await ACL.getAll();
  await ACL.setAll(ACLs)
  await ACL.create(domainName)

  const application = await Application.create(domainName)
  await Application.assignToGroup(application.user)

  const response = await PermissionGroup.create(application, domainName)

  body.countryCode = body.countryCode.toUpperCase()
  const dataflows = await Dataflow.getAll()

  const importDataflow = await Dataflow.create(dataflows[0])
  await Dataflow.setScheduleInit(importDataflow.id)
  await Dataflow.setSchedule(importDataflow.id)

  const exportDataflow = await Dataflow.create(dataflows[1])
  await Dataflow.setScheduleInit(exportDataflow.id)
  await Dataflow.setSchedule(exportDataflow.id)


  const copiedBlueprint = await Google.GDrive.makeACopy({ fileId: Google.config.BP })

  const newFolder = await Google.GDrive.createFolder({
    name: body.countryCode,
    parent: Google.config[environment]
  })

  const GSheetfile = await Google.GDrive.renameAndMoveFile({
    fileId: copiedBlueprint.data.id,
    newName: `${body.countryCode} - Gigya group management`,
    parent: newFolder.data.id
  })

  await Google.GSheet.replaceCells({
    fileId: GSheetfile.data.id,
    country: {
      fullname: body.countryFullname,
      ISOCode: body.countryCode,
    }
  })

  const developers = await Google.GSheet.getDevelopers()

  await Google.GSheet.addPermissionsToProtectedCells({
    fileId: GSheetfile.data.id,
    emails: developers
  })

  await Google.GSheet.addSheetToList({
    fileId: GSheetfile.data.id,
    country: {
      fullname: body.countryFullname,
      ISOCode: body.countryCode,
    }
  })

}
