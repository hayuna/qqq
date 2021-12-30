import Dataflow from './controllers/Dataflow/index.js'
import Application from './controllers/Application/index.js'
import ACL from './controllers/ACL/index.js'
import WebSDK from './controllers/WebSDK/index.js'
import PermissionGroup from './controllers/PermissionGroup/index.js'
import Site from './controllers/Site/index.js'
import Google from './controllers/Google/index.js'
import {Console} from './utils.js' 

export const createSite = async (req, res) => {
  try {
    global.body = req.body
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

  const site = await Site.create(domainName)
  global.apiKey = site.apiKey
  await Site.connectWithParent()

  const masterWebSDK = await WebSDK.get()
  await WebSDK.set(masterWebSDK.globalConf)

  const ACLs = await ACL.getAll();
  await ACL.setAll()

  const application = await Application.create(domainName)
  await Application.assignToGroup(application.user)

  const response = await PermissionGroup.create(application, domainName, ACLs)
  Console.log(response)

  body.countryCode = body.countryCode.toUpperCase()
  const dataflows = await Dataflow.getAll()
  Console.log(dataflows)

  const importDataflow = await Dataflow.create(dataflows[0])
  await Dataflow.setScheduleInit(importDataflow.id)
  await Dataflow.setSchedule(importDataflow.id)

  const exportDataflow = await Dataflow.create(dataflows[1])
  await Dataflow.setScheduleInit(exportDataflow.id)
  await Dataflow.setSchedule(exportDataflow.id)
  Console.log({ importDataflow, exportDataflow })

  /* SKIP GOOGLE PART WHEN ENV = SANDBOX */
  if (environment !== 'SANDBOX') {
    Console.log('Make a copy of blueprint GSheet');
    const copiedBlueprint = await Google.GDrive.makeACopy({ fileId: Google.config.BP })

    Console.log('Create [[COUNTRY]] in [[ENV]] folder')
    const newFolder = await Google.GDrive.createFolder({
      name: body.countryCode,
      parent: Google.config[environment]
    })

    Console.log('Paste copied file to [[ENV]]/[[COUNTRY]] and rename file to [[COUNTRY]] - Gigya group management')
    const GSheetfile = await Google.GDrive.renameAndMoveFile({
      fileId: copiedBlueprint.data.id,
      newName: `${body.countryCode} - Gigya group management`,
      parent: newFolder.data.id
    })

    Console.log('Change cell: country full name');
    Console.log('Change cell: country ISO Code');
    await Google.GSheet.replaceCells({
      fileId: GSheetfile.data.id,
      country: {
        fullname: body.countryFullname,
        ISOCode: body.countryCode,
      }
    })

    Console.log('Add permissions to protected cells');
    const developers = await Google.GSheet.getDevelopers()

    await Google.GSheet.addPermissionsToProtectedCells({
      fileId: GSheetfile.data.id,
      emails: developers
    })

    Console.log('Add GSheet to the list of CUG Gsheet')
    await Google.GSheet.addSheetToList({
      fileId: GSheetfile.data.id,
      country: {
        fullname: body.countryFullname,
        ISOCode: body.countryCode,
      }
    })
  }
}
