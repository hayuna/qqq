import FormData from "form-data";
import { etlAPI, etlMasterAPI } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const Dataflow = {
  async replaceVariables(template) {
    template = JSON.stringify(template)
    template = template.replaceAll('[[COUNTRY_CODE]]', body.countryCode)
    template = template.replaceAll('[[ACCESS_KEY]]', '<$AWSclientID$>')
    template = template.replaceAll('[[SECRET_KEY]]', '<$AWSSecret$>')
    template = template.replaceAll('********', '<$AWSSecret$>')

    switch (environment.toLowerCase()) {
      case 'PROD':
        template = template.replaceAll('[[ENV]].', '');
        break;
      case 'SANDBOX':
        template = template.replaceAll('[[ENV]]', 'dev');
        break;
      default:
        template = template.replaceAll('[[ENV]]', environment.toLowerCase());
        break;
    }

    template = JSON.parse(template)
    return template
  },

  async create(template) {
    const data = new FormData();
    data.append("apiKey", apiKey)
    const temp = await this.replaceVariables(template)
    data.append("data", JSON.stringify(temp))
    const response = await etlAPI(data, '/idx.createDataflow')
    return response
  },

  async setScheduleInit(dataflowId) {
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
  },

  async setSchedule(dataflowId) {
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
      failureEmailNotification: environment !== 'SANDBOX' ? "marek.kowalonek@contractors.roche.com" : "sandbox@notexist.com"
    }))
    await etlAPI(data, '/idx.createScheduling')
  },

  async getAll() {
    const data = new FormData();
    data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey)
    data.append("query", `SELECT * FROM dataflow`)
    const response = await etlMasterAPI(data, '/idx.search')
    Console.log(response)
    const ETLs = response.result
      .filter(dataflow => dataflow.name.includes('CUG'))
      .map(({ name, steps, description }) => ({
        name, steps, description
      }))

    return ETLs
  }



}

export default Dataflow





