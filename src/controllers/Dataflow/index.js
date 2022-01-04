import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const Dataflow = {
  async replaceVariables(template) {
    Console.log('___ Replacing variables in Dataflows')
    template = JSON.stringify(template)
    template = template.replaceAll('[[COUNTRY_CODE]]', body.countryCode)
    Console.log(`___ ✅ Replaced [[COUNTRY_CODE]] with ${body.countryCode}`)
    template = template.replaceAll('[[ACCESS_KEY]]', '<$AWSclientID$>')
    Console.log(`___ ✅ Replaced [[ACCESS_KEY]] with <$AWSclientID$>`)
    template = template.replaceAll('[[SECRET_KEY]]', '<$AWSSecret$>')
    template = template.replaceAll('********', '<$AWSSecret$>')
    Console.log(`___ ✅ Replaced [[SECRET_KEY]] with <$AWSSecret$>`)

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
    Console.log(`___ ✅ Replaced [[ENV]] with proper environment`)

    template = JSON.parse(template)
    return template
  },

  async create(template) {
    Console.log('22. Creating Dataflows')
    const data = new FormData();
    data.append("apiKey", apiKey)
    const temp = await this.replaceVariables(template)
    data.append("data", JSON.stringify(temp))
    const response = await api.etl(data, '/idx.createDataflow')
    Console.log('✅ Dataflows created')
    return response
  },

  async setScheduleInit(dataflowId) {
    Console.log('23. Setting schedule for all records')
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
    await api.etl(data, '/idx.createScheduling')
    Console.log('✅ Schedule for all records was created')
  },

  async setSchedule(dataflowId) {
    Console.log('24. Setting schedule for delta records')
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
    await api.etl(data, '/idx.createScheduling')
    Console.log('✅ Schedule for delta records was created')
  },

  async getAll() {
    Console.log('21. Retrieving Dataflows from Master Template')
    const data = new FormData();
    data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey)
    data.append("query", `SELECT * FROM dataflow`)
    const response = await api.etl(data, '/idx.search', true)
    const ETLs = response.result
      .filter(dataflow => dataflow.name.includes('CUG'))
      .map(({ name, steps, description }) => ({
        name, steps, description
      }))

    Console.log('✅ Dataflows retrieved from Master Template')
    return ETLs
  }



}

export default Dataflow





