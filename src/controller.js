import { errorHandler } from "./utils.js";
import Dataflow from './controllers/Dataflow/index.js'
import Application from './controllers/Application/index.js'
import ACL from './controllers/ACL/index.js'
import WebSDK from './controllers/WebSDK/index.js'
import PermissionGroup from './controllers/PermissionGroup/index.js'
import Site from './controllers/Site/index.js'
import Google from './controllers/Google/index.js'

export const createSite = async (req, res) => {
  try {
    global.body = req.body
    await create('SANDBOX')
    // await create('DEV')
    // await create('TEST')
    // await create('PROD')
    res.json({ message: 'OK' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const create = async (environment) => {
  global.environment = environment
  const domainName = Site.generateName();

  const site = await Site.create(domainName)
  errorHandler(site)
  global.apiKey = site.apiKey

  const connection = await Site.connectWithParent()
  errorHandler(connection)

  const masterWebSDK = await WebSDK.get()
  errorHandler(masterWebSDK)

  const newWebSDK = await WebSDK.set(masterWebSDK.globalConf)
  errorHandler(newWebSDK)

  const ACLs = await ACL.getAll();
  errorHandler(ACLs)

  const newACLs = await ACL.setAll()
  errorHandler(newACLs)

  const application = await Application.create(domainName)
  errorHandler(application)

  const applicationInConsole = await Application.assignToGroup(application.user)
  errorHandler(applicationInConsole)

  const response = await PermissionGroup.create(application, domainName, ACLs)
  errorHandler(response.permissionGroup)
  console.log(response)

  body.countryCode = body.countryCode.toUpperCase()
  const dataflows = await Dataflow.getAll()
  errorHandler(dataflows)
  console.log(dataflows)

  const importDataflow = await Dataflow.create(dataflows[0])
  errorHandler(importDataflow)
  await Dataflow.setScheduleInit(importDataflow.id)
  await Dataflow.setSchedule(importDataflow.id)

  const exportDataflow = await Dataflow.create(dataflows[1])
  errorHandler(exportDataflow)
  await Dataflow.setScheduleInit(exportDataflow.id)
  await Dataflow.setSchedule(exportDataflow.id)
  console.log({ importDataflow, exportDataflow })

  /* SKIP GOOGLE PART WHEN ENV = SANDBOX */
  if (environment !== 'SANDBOX') {
    console.log('Make a copy of blueprint GSheet')
    const copiedBlueprint = await Google.GDrive.makeACopy({ fileId: Google.config.BP })
    errorHandler(copiedBlueprint)

    console.log('Create [[COUNTRY]] in [[ENV]] folder')
    const newFolder = await Google.GDrive.createFolder({
      name: body.countryCode,
      parent: Google.config[environment]
    })
    errorHandler(newFolder)

    console.log(['Paste copied file to [[ENV]]/[[COUNTRY]] and rename file to [[COUNTRY]] - Gigya group management'])
    const GSheetfile = await Google.GDrive.renameAndMoveFile({
      fileId: copiedBlueprint.data.id,
      newName: `${body.countryCode} - Gigya group management`,
      parent: newFolder.data.id
    })
    errorHandler(GSheetfile)

    console.log('Change cell: country full name');
    console.log('Change cell: country ISO Code');
    await Google.GSheet.replaceCells({
      fileId: GSheetfile.data.id,
      country: {
        fullname: body.countryFullname,
        ISOCode: body.countryCode,
      }
    })

    console.log('Add permissions to protected cells');
    const developers = await Google.GSheet.getDevelopers()
    errorHandler(developers)
    console.log(developers)

    await Google.GSheet.addPermissionsToProtectedCells({
      fileId: GSheetfile.data.id,
      emails: developers
    })

    console.log('Add GSheet to the list of CUG Gsheet')
    await Google.GSheet.addSheetToList({
      fileId: GSheetfile.data.id,
      country: {
        fullname: body.countryFullname,
        ISOCode: body.countryCode,
      }
    })
  }
}
