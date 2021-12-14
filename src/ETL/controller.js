import FormData from "form-data";
import { etlAPI, etlMasterAPI } from "../api.js";
import config from '../config.js'

const replaceVariables = async (template) => {
  template = JSON.stringify(template)
  template = template.replaceAll('[[COUNTRY_CODE]]', body.countryCode)
  template = template.replaceAll('[[ACCESS_KEY]]', '<$AWSclientID$>')
  template = template.replaceAll('[[SECRET_KEY]]', '<$AWSSecret$>')
  template = template.replaceAll('[[ENV]]', environment)
  template = JSON.parse(template)
  return template
}

export const etlController = async (apiKey) => {
  body.countryCode = body.countryCode.toUpperCase()
  const result = await process(apiKey)
  return result
};

const process = async (apiKey) => {
  const dataflows = await getDataflows()
  console.log(dataflows)

  const importDataflow = await create(dataflows[0], apiKey)
  await setScheduleInit(importDataflow.id, apiKey)
  await setSchedule(importDataflow.id, apiKey)

  const exportDataflow = await create(dataflows[1], apiKey)
  await setScheduleInit(exportDataflow.id, apiKey)
  await setSchedule(exportDataflow.id, apiKey)
  console.log({ importDataflow, exportDataflow })
}

const create = async (template, apiKey) => {
  const data = new FormData();
  data.append("apiKey", apiKey)
  const temp = await replaceVariables(template)
  data.append("data", JSON.stringify(temp))
  const response = await etlAPI(data, '/idx.createDataflow')
  return response
}

const setScheduleInit = async (dataflowId, apiKey) => {
  const data = new FormData();
  data.append("apiKey", apiKey)
  data.append("data", JSON.stringify({
    name: "run",
    dataflowId: dataflowId,
    frequencyType: "once",
    frequencyInterval: null,
    daysOfWeek: null,
    nextJobStartTime: "2021-12-01T10:03:14.607Z",
    currentJobStartTime: null,
    successEmails: null,
    failureEmails: null,
    limit: null,
    fullExtract: true,
    enabled: true,
    id: "Will be generated upon creation",
    logLevel: "info",
  }))
  await etlAPI(data, '/idx.createScheduling')
}

const setSchedule = async (dataflowId, apiKey) => {
  const data = new FormData();
  data.append("apiKey", apiKey)
  data.append("data", JSON.stringify({
    name: "every hour",
    dataflowId: dataflowId,
    frequencyType: "hour",
    frequencyInterval: 1,
    daysOfWeek: null,
    nextJobStartTime: "2021-12-01T10:03:14.607Z",
    currentJobStartTime: null,
    successEmails: null,
    failureEmails: null,
    limit: null,
    fullExtract: false,
    enabled: true,
    id: "Will be generated upon creation",
    logLevel: "info",
    failureEmailNotification: "marek.kowalonek@contractors.roche.com"
  }))
  await etlAPI(data, '/idx.createScheduling')
}

export const getDataflows = async () => {
  const data = new FormData();
  data.append("apiKey", config.MASTER_TEMPLATE.apiKey)
  data.append("query", `SELECT * FROM dataflow`)
  const response = await etlMasterAPI(data, '/idx.search')
  console.log(response)
  const ETLs = response.result
    .filter(dataflow => dataflow.name.includes('CUG'))
    .map(({ name, steps, description }) => ({
      name, steps, description
    }))

  return ETLs
};