import {APLLICATION_RECORD} from './Constants';
import * as formDao from '../database/Tables/formDao';
import * as formServices from '../services/formServices';
import * as uploadDao from '../database/Tables/uploadDao';
import * as eventService from '../services/eventServices';
import * as receiverDao from '../database/Tables/receiverDao';
import * as form2UserDao from '../database/Tables/form2UserDao';
import * as superDao from '../database/Tables/superSelectDAO';
import * as userDao from '../database/Tables/userDao';
import * as utility from '../database/UtilityService';
import * as employeeDao from '../database/Tables/employeeDAO';
import {API_ENDPOINTS, API_ENDPOINT_BASE_URL} from '../constants/constants';
import {NativeModules} from 'react-native';
import RNFS from 'react-native-fs';
import {getToken, setToken} from '../Utilities/util';
import { Axios } from 'axios';

export const initialStateSyncService = {
  syncStart: 0,
  syncTimings: [],
  serverTimestamp: 0,
  currentForms: [],
  failedImages: [],
  uploadFileDataRecord: ''
};

/**
 * Build records for all forms in current event
 * @returns {Promise<any[] | void>}
 */
export const gatherAllFormData = async (modifiedOnly = true) => {
  let forms = await formDao.getList(APLLICATION_RECORD.APP_EVENT_ID);
  initialStateSyncService.currentForms = forms;
  const promises = [];
  for (let i = 0; i < forms.length; ++i) {
    if (forms[i].remoteId <= 0) {
      continue;
    }
    let p = buildRecords(forms[i], null, modifiedOnly);
    promises.push(p);
  }
  return Promise.all(promises).then(result => {
    let master = [];
    for (let i = 0; i < result.length; ++i) {
      master = master.concat(result[i]);
    }

    //this.addTiming("getFormData");
    return master;
  });
};

export const getCollectionFields = fields => {
  let ele = JSON.parse(fields.elements);
  let result = [];
  const recurseElements = element => {
    if (element.type == 'collection') {
      if (element.name && element.name.length) {
        result.push(element.name);
      }
    } else if (element.hasOwnProperty('children')) {
      element.children.forEach(recurseElements);
    }
  };
  ele.forEach(recurseElements);
  return result;
};

export const getCollectionFields1 = fields => {
  let ele = fields.elements;
  let result = [];
  const recurseElements = element => {
    if (element.type == 'collection') {
      if (element.name && element.name.length) {
        result.push(element.name);
      }
    } else if (element.hasOwnProperty('children')) {
      element.children.forEach(recurseElements);
    }
  };
  ele.forEach(recurseElements);
  console.log('getCollectionFields()', result);
  return result;
};

export const enumerate = () => {
  let index = 0;
  let collectionId = 0;
  const recurseElements = element => {
    element['id'] = ++index;

    if (collectionId) {
      element.collectionId = collectionId;
    }

    if (element.type == 'collection') {
      collectionId = element['id'];
    }

    if (element.hasOwnProperty('children')) {
      if (!Array.isArray(element.children)) {
        element.children = [];
      }
      element.children.forEach(recurseElements);
    }

    if (element.type == 'collection') {
      collectionId = 0;
    }

    element['default'] = element['value'];

    if (element.options && element.options.length) {
      let selected = [];
      element.options.forEach(option => {
        if (option.selected) {
          selected.push(option.value);
        }
      });
      element['default'] = selected;
    }
  };
  this.fields.forEach(recurseElements);
};

export const generateTranslations = (
  generate = true,
  lang = null,
  fallbackLang = null,
) => {
  //let translations // = generate ? {} : this.translations;
  let count = 0;

  if (lang) {
    this._currentLanguage = lang;
  }

  const processField = (object, field) => {
    let key = 'translate_' + ++count;

    if (generate) {
      if (object[field] === null) {
        object[field] = '';
      } else if (typeof object[field] == 'object') {
        translations[key] = object[field];
        object[field] = key;
        //object[field] = translations[key][fallbackLang];
      }
    }

    if (lang && translations.hasOwnProperty(key)) {
      let s = translations[key][lang];
      if ((!s || !s.length) && fallbackLang) {
        s = translations[key][fallbackLang];
      }
      object[field] = s || '';
    }
  };

  const recurseElements = element => {
    processField(element, 'label');
    processField(element, 'placeholder');

    if (Array.isArray(element.options)) {
      element.options.forEach(option => {
        processField(option, 'text');
      });
    }

    if (element.hasOwnProperty('children')) {
      element.children.forEach(recurseElements);
    }
  };

  this.fields.forEach(recurseElements);

  if (generate) {
    this.translations = translations;
  }
};

/**
 * Build records for sending to the server
 * @param form
 * @param recordId if specified just build this specific record
 * @param modifiedOnly
 * @returns {Promise<any[]>} records
 */
export const buildRecords = (form, recordId = null, modifiedOnly = true) => {
  // get collection fields
  let collFields = getCollectionFields(form);
  let collData = {};
  let promises = [];
  collFields.forEach(async field => {
    // load data from database
    let p = await formDao
      .getCollectionData(form.id, field, recordId)
      .then(rows => {
        rows.forEach(row => {
          collData[row.record_id] = collData[row.record_id] || {};
          collData[row.record_id][field] = collData[row.record_id][field] || [];
          collData[row.record_id][field].push(row);
        });
      });
    promises.push(p);
  });
  let eventId = APLLICATION_RECORD.APP_EVENT_ID;
  return Promise.all(promises).then(() => {
    // colldata is filled now

    return formDao
      .getRecords(form.id, eventId, recordId, modifiedOnly)
      .then(records => {
        let result = [];

        for (let i = 0; i < records.length; ++i) {
          let cur = records[i];

          result.push(prepareRecord(form, cur, collData[cur.id]));
        }

        return result;
      });
  });
};

/**
 * Build records for sending to the server
 * @param form
 * @param recordId if specified just build this specific record
 * @param modifiedOnly
 * @returns {Promise<any[]>} records
 */
export const buildRecords1 = (form, recordId = null, modifiedOnly = true) => {
  // get collection fields
  let collFields = getCollectionFields1(form);
  let collData = {};
  let promises = [];
  collFields.forEach(async field => {
    // load data from database
    let p = await formDao
      .getCollectionData(form.id, field, recordId)
      .then(rows => {
        rows.forEach(row => {
          collData[row.record_id] = collData[row.record_id] || {};
          collData[row.record_id][field] = collData[row.record_id][field] || [];
          collData[row.record_id][field].push(row);
        });
      });
    promises.push(p);
  });
  let eventId = APLLICATION_RECORD.APP_EVENT_ID;
  return Promise.all(promises).then(() => {
    // colldata is filled now

    return formDao
      .getRecords(form.id, eventId, recordId, modifiedOnly)
      .then(records => {
        let result = [];

        for (let i = 0; i < records.length; ++i) {
          let cur = records[i];

          result.push(prepareRecord(form, cur, collData[cur.id]));
        }

        return result;
      });
  });
};

/**
 * Prepare record for sending to server
 * @param  form
 * @param record
 * @param collectionData
 * @returns {{form_id: number; form_random_key: string; form_version: number; form_production: boolean; local_id: string; remote_id: any; event_id: number; guid: any; lead_id: any; lead_lang: any; created_on: number; sync_on: number | string; deleted: any; deleted_by: any; data: any}}
 */
export const prepareRecord = (form, record, collectionData) => {
  // merge collection data
  if (collectionData && typeof collectionData == 'object') {
    for (let field in collectionData) {
      //cur[field] = collData[cur.id][field];
      if (!collectionData.hasOwnProperty(field)) {
        continue;
      }

      let colRecs = collectionData[field];
      colRecs.forEach(rec => {
        for (let col in rec) {
          if (!rec.hasOwnProperty(col)) {
            continue;
          }
          if (col == 'id' || col == 'record_id') {
            continue;
          }
          if (!record[col] || !Array.isArray(record[col])) {
            record[col] = [];
          }

          // shorten file paths
          let v = rec[col];
          // if (typeof v == "string" && v.indexOf('file://') === 0){
          //     v = "server://" + v.substr(v.lastIndexOf("/")+1);
          // }
          record[col].push(v);
        }
      });
    }
  }

  const result = {
    form_id: form.remoteId,
    form_random_key: form.randomKey,
    form_version: form.version,
    form_production: form.production,
    local_id: form.id + '_' + record['id'],
    remote_id: record['remote_id'],
    event_id: APLLICATION_RECORD.APP_EVENT_ID, // MyApp.currentEvent.remoteId,
    guid: record['guid'],
    lead_id: record['lead_id'],
    lead_lang: record['lead_lang'],
    created_on: Math.round(record['timestamp'] / 1000),
    sync_on: record['sync_on'] ? Math.round(record['sync_on'] / 1000) : '',
    deleted: record['deleted'],
    deleted_by: record['deleted_by'],
    contact_checked: record['contact_checked'],
    selected_user_id: record['selected_user_id'],
    draft: record['draft'],
    waitlist_user_id: record['waitlist_user_id'],
    data: record,
  };

  delete record['id'];
  delete record['remote_id'];
  delete record['form_id'];
  delete record['user_id'];
  delete record['timestamp'];
  delete record['deleted'];
  delete record['deleted_by'];
  delete record['guid'];
  delete record['lead_id'];
  delete record['lead_lang'];
  delete record['sync_on'];
  delete record['contact_checked'];
  delete record['selected_user_id'];

  return result;
};

export const submitFormDataAction = async data => {
  // console.log('submitFormDataAction', data)
  try {
    const token = APLLICATION_RECORD.CURRENT_USER.token;
    const response = await formServices.submitFormDataActionService(
      data,
      token,
    );
    //let result = JSON.stringify(response);
    if (response?.status === 200 && response?.data?.success) {
      let res = await formDao.setRemoteRecordIds(
        response.data.data,
        response.syncDate,
      );
      return Promise.all(res);
    } else {
      return null;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

export const submitImagesNew = (
  failOnError = false,
  formId = null,
  recordId = null,
) => {
  let formIds = [];
  if (formId) {
    formIds.push(formId);
  } else {
    initialStateSyncService.currentForms.forEach(form => formIds.push(form.id));
  }

  return uploadDao
    .getFilesForUpload(APLLICATION_RECORD.APP_EVENT_ID, formIds, recordId)
    .then(uploads => {
      const queue = [];
      const rootDir = RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath;

      uploads.forEach(upload => {
        queue.push({
          form_id: upload.remote_form_id, // this is the remote form id rootDir +
          record_id: upload.remote_record_id,
          local_id: upload.record_id,
          index: upload.coll_idx,
          guid: upload.record_guid,
          name: upload.field,
          file:  upload.path,
        });
      });

      if (!queue.length) {
        return '';
      }

      return checkFiles(queue).then(async result => {
        let index = -1;
        let wantedFiles = initialStateSyncService.uploadFileDataRecord // await result.wanted;

        return new Promise((resolve, reject) => {
          const getNext = () => {
            if (++index >= queue.length) {
              return resolve();
            }

            let queueItem = queue[index];

            if (wantedFiles.indexOf(queueItem.file) == -1) {
              return getNext();
            }

            uploadFile(queueItem).then(res => {
              return getNext();
            });
          };

          getNext();
        }).then((res) => {
          console.log(res)
          // re-validate with server
          return checkFiles(queue).then(result => {
            //let wantedFiles = result.wanted;
            let haveFiles = result.have;
            let promises = [];
            uploads.forEach(upload => {
              let file = rootDir + upload.path;
              if (haveFiles.indexOf(file) != -1) {
                // mark this as uploaded
                upload.uploaded = true;
                promises.push(uploadDao.save(upload));
              }
            });
            // alert(JSON.stringify(promises))
            return Promise.all(promises);
          });
        });
      });
    });
};

export const checkFiles = async data => {
  try {
    const token = APLLICATION_RECORD.CURRENT_USER.token;
    const response = await formServices.checkFilesActionService({files: data}, token);
    let result = JSON.stringify(response);
    if (response?.status === 200 && response?.data?.success) {
      initialStateSyncService.uploadFileDataRecord = response.data.wanted || []
      return {
        wanted: response.data.wanted || [],
        have: response.data.have || [],
      };

      

    } else {
      return null;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

export const uploadFile1 = queueItem => {


}

export const uploadFile = async queueItem => {
  var files = [
    {
      name: 'test1',
      filename:queueItem.file.substr(queueItem.file.lastIndexOf('/') + 1),
      filepath: queueItem.file,
      filetype: 'image/jpeg'
    }
  ];

  let data1 =  {'form_id': queueItem.form_id,
  'record_id': queueItem.record_id,
  'local_id': queueItem.local_id,
  'index': queueItem.index,
  'guid': queueItem.guid,
  'name': queueItem.name,}


  const data = new FormData();
  data.append('file', {
    name: queueItem.file.substr(queueItem.file.lastIndexOf('/') + 1),
    type: 'image/jpeg',
    uri: queueItem.file
  });
  data.append('form_id',queueItem.form_id);
  data.append('record_id',queueItem.record_id);
  data.append('local_id',queueItem.local_id);
  data.append('index',queueItem.index);
  data.append('guid',queueItem.guid);
  data.append('name',queueItem.name);

  return await fetch(API_ENDPOINT_BASE_URL + 'api/savePhoto', {
  method: "post",
  body: data,
  headers: {
    "Content-Type": "multipart/form-data; ",
   'Accept': 'application/json',
   'X-AUTH-TOKEN' : APLLICATION_RECORD.CURRENT_USER.token
  },
});



  
// RNFS.uploadFiles({
//   toUrl:  API_ENDPOINT_BASE_URL + 'api/savePhoto',
//   files:files,
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'X-AUTH-TOKEN' : APLLICATION_RECORD.CURRENT_USER.token
//   },
//   fields: data
// }).promise.then((response) => {
//     if (response.statusCode == 200) {
//       console.log('FILES UPLOADED!'); 
//     } else {
//       console.log('SERVER ERROR');
//     }
//   })
//   .catch((err) => {
//     if(err.description === "cancelled") {
//     }
//     console.log(err);
//   });


  // var obj = {
  //   uri: queueItem.file, 
  //   uploadUrl: API_ENDPOINT_BASE_URL + 'api/savePhoto',
  //   fileName: queueItem.file.substr(queueItem.file.lastIndexOf('/') + 1),
  //   data: {
  //     form_id: queueItem.form_id,
  //     record_id: queueItem.record_id,
  //     local_id: queueItem.local_id,
  //     index: queueItem.index,
  //     guid: queueItem.guid,
  //     name: queueItem.name,
  //   },
  //   headers: {
      
  //   },
  // };

  // return NativeModules.FileTransfer.upload(obj, (err, res) => {
   
  //   if (err) {
      
  //     initialStateSyncService.failedImages.push({
  //       form_id: queueItem.form_id,
  //       guid: queueItem.guid,
  //     });
  //   } else {
  //     console.log(res)
  //     return true;
  //   }
  // });
};

export const getEventInfo = async () => {
  const eventId = APLLICATION_RECORD.EVENT.remoteId;
  const modified = APLLICATION_RECORD.EVENT.modified;
  const url =
    API_ENDPOINTS.eventInfo +
    '?eventid=' +
    eventId +
    '&modified=' +
    modified +
    '&_dc=' +
    new Date().getTime();
  const headers = {
    //'X-AUTH-TOKEN': APLLICATION_RECORD.CURRENT_USER.token || '',
  };

  const res = await eventService.eventInfo(url, {}, headers);

  let result = JSON.parse(res.data) || {};

  if (!result || !result.success) {
    throw result && result.error;
  }

  if (!result.event) {
    // console.log("getEventInfo(): no changes");
    return;
  }

  // update event
  const event = APLLICATION_RECORD.EVENT;
  const data = result.event;

  event.modified = data.modified;
  event.name = data.name;
  event.shortCode = data.shortCode || '';
  event.config = data.appConfig || '{}';
  // alert(" Event info : "+JSON.stringify(event))

  // await updateLogo(event, "logo", data.logo);
  // await updateLogo(event, "companyLogo", data.companyLogo);
  // await eventDao.save(event);
};

/**
 * Build records
 * @returns {Promise<any[]>} records
 */
export const getRemoteForms = async () => {
  console.log('remote forms');
  console.log(APLLICATION_RECORD.APP_EVENT_ID);
  const eventId = APLLICATION_RECORD.APP_EVENT_ID;
  const url =
    API_ENDPOINTS.getForms +
    '?eventid=' +
    eventId +
    '&_dc=' +
    new Date().getTime();
  const token = APLLICATION_RECORD.CURRENT_USER.token;
  const response = await formServices.getFormsActionService(url, token);

  if (response?.data) {
    let forms = [];
    try {
      forms = response.data || [];
    } catch (error) {
      return Promise.resolve(error);
    }

    let existingIds = [];
    let promises = [];
    for (let i = 0; i < forms.length; ++i) {
      existingIds.push(forms[i].id);
      forms[i].elements = forms[i].elements || [];
      //let leadReceiver = forms[i].elements;
      let leadReceiver = cutLeadReceivers(forms[i].elements);
      if (leadReceiver && leadReceiver.length) {
        promises.push(await receiverDao.initTable(forms[i].id, leadReceiver));
      }
      promises.push(await updateForm(forms[i]));
    }

    return Promise.all(promises).then(async () => {
      // this.addTiming("getRemoteForms");
      return await formDao
        .getLocalFormIds(APLLICATION_RECORD.APP_EVENT_ID)
        .then(async map => {
          let localIds = [];
          existingIds.forEach(remoteId => {
            if (map.hasOwnProperty(remoteId)) {
              localIds.push(map[remoteId]);
            }
          });
          return await form2UserDao.setFormsForUser(
            APLLICATION_RECORD.APP_EVENT_ID,
            APLLICATION_RECORD.APP_USER_ID,
            localIds,
          );
        });
    });
  } else {
    return Promise.resolve([]);
  }
};

export const cutLeadReceivers = elements => {
  let list = [];

  const recurseElements = (elements, index) => {
    let element = elements[index];
    if (element.type == 'leadsResever') {
      list = element.children;
      elements.splice(index, 1);
      return;
    }

    if (element.hasOwnProperty('children') && element.children) {
      for (let i = element?.children?.length - 1; i >= 0; --i) {
        recurseElements(element.children, i);
      }
    }
  };

  for (let i = elements?.length - 1; i >= 0; --i) {
    recurseElements(elements, i);
  }
  return list;
};

export const updateForm = async (form = {}) => {
  let remoteId = form['id'];
  if (!form['elements']) {
    form['elements'] = [];
  }
  if (!form['viewColumns'] || !form['viewColumns'].length) {
    form['viewColumns'] = [];
  }

  let addColumns = ['timestamp', 'lead_id', 'sync_on'];

  for (let i = addColumns.length - 1; i >= 0; --i) {
    if (form['viewColumns'].indexOf(addColumns[i]) != -1) {
      addColumns.splice(i, 1);
    }
  }

  form['viewColumns'] = addColumns.concat(form['viewColumns']);

  if (!form['searchColumns'] || !form['searchColumns'].length) {
    form['searchColumns'] = form['viewColumns'];
  }
  return await formDao
    .getFormByRemoteId(remoteId)
    .then(async existingForm => {
      if (existingForm) {
        // update existing
        existingForm.name = form['name'];
        existingForm.shortCode = form['shortCode'];
        existingForm.defaultLanguage = form['defaultLanguage'];
        existingForm.fallbackLanguage = form['fallbackLanguage'];
        existingForm.languages = JSON.stringify(form['languages']);
        existingForm.elements = JSON.stringify(form['elements']);
        existingForm.viewColumns = JSON.stringify(form['viewColumns']);
        existingForm.searchColumns = JSON.stringify(form['searchColumns']);
        existingForm.eventId = APLLICATION_RECORD.APP_EVENT_ID;
        existingForm.randomKey = form['randomKey'];
        existingForm.deleted = 0;
        existingForm.version = form['version'];
        existingForm.production = form['production'];
        return await formDao.saveFile(existingForm);
      } else {
        // new form
        let newForm = {};
        newForm['remoteId'] = form['id'];
        newForm['name'] = form['name'];
        newForm['shortCode'] = form['shortCode'];
        newForm['defaultLanguage'] = form['defaultLanguage'];
        newForm['fallbackLanguage'] = form['fallbackLanguage'];
        newForm['languages'] = JSON.stringify(form['languages']);
        newForm['elements'] = JSON.stringify(form['elements']);
        newForm['viewColumns'] = JSON.stringify(form['viewColumns']);
        newForm['searchColumns'] = JSON.stringify(form['searchColumns']);
        newForm['eventId'] = APLLICATION_RECORD.APP_EVENT_ID;
        newForm['randomKey'] = form['randomKey'];
        newForm['deleted'] = 0;
        newForm['version'] = form['version'];
        newForm['production'] = form['production'];
        return await formDao.saveFile(newForm);
      }
    })
    .then(async () => {
      // superselects
      return await processRemoteForm(form['elements']);
    });
};

export const processRemoteForm = formElements => {
  // find superselects
  const objectIDs = [];

  const recursiveSearch = element => {
    if (element.hasOwnProperty('children')) {
      // layout component
      if (!Array.isArray(element.children)) {
        element.children = [];
      }
      element.children.forEach(el => recursiveSearch(el));
    }

    if (element.type == 'superselect' || element.type == 'sendleadto') {
      objectIDs.push([element.objektId, element.dataSourceId]);
    }
  };

  formElements.forEach(el => recursiveSearch(el));

  const promises = [];

  objectIDs.forEach(async arr =>
    promises.push(await getNestedListData(arr[0], arr[1])),
  );

  return Promise.all(promises);
};

export const getNestedListData = async (objectId, dataSourceId) => {
  // pull from server
  let dataSources = getToken('datasources') || '{}';

  if (
    dataSources.hasOwnProperty(objectId) &&
    dataSources[objectId] == dataSourceId
  ) {
    return Promise.resolve();
  }

  //console.log("About to download DataSource id: %s source: %s", objectId, dataSourceId);
  const url =
    API_ENDPOINTS.getNestedList + objectId + '?_dc=' + new Date().getTime();

  let limit = 10000;
  let offset = 0;
  while (true) {
    const params = {
      limit: limit.toString(),
      offset: offset.toString(),
    };
    // let res = await this.nativeHttp.get(url, params, headers);
    const res = await formServices.getNestedFormActionService(url, params);
    //console.log('getNestedFormActionService',res)

    let data = res.data;
    await superDao.initTable(objectId, data, offset == 0);

    if (!data.total || data.total <= offset + limit) {
      break;
    }

    offset += limit;
  }

  // update localstorage
  dataSources = getToken('datasources') || '{}';
  dataSources[objectId] = dataSourceId;
  setToken('datasources', JSON.stringify(dataSources));
  return Promise.resolve();
};

/**
 * Load records from server and store/update local data
 * @returns {Promise<any[]>} records
 */
export const getRecordsFromServer = async (fullSync = false) => {
  //   console.log('call getRecordsFromServer')
  const eventId = APLLICATION_RECORD.APP_EVENT_ID;
  let url =
    API_ENDPOINTS.reportList +
    '?eventid=' +
    eventId +
    '&_dc=' +
    new Date().getTime();
  if (!fullSync) {
    const lastSync = getToken('last-sync') || '{}';
    if (lastSync.hasOwnProperty(eventId)) {
      url += '&timestamp=' + lastSync[eventId];
    }
  }
  let flags = {};
  if (flags.hasOwnProperty(APLLICATION_RECORD.CURRENT_USER.remoteId)) {
    url +=
      '&backsync=' + (flags[APLLICATION_RECORD.CURRENT_USER.remoteId] ? 1 : 0);
  }

  const token = APLLICATION_RECORD.CURRENT_USER.token;
  const resp = await formServices.getRecordActionService(url, token);

  //   console.log(resp?.status, resp?.data?.success)

  if (resp?.status === 200 && resp?.data?.success) {
    try {
      let response = resp.data;
      let removeFromAll = false;
      if (response.hasOwnProperty('backSync')) {
        let flags = getToken('back-sync') || '{}';
        // always remove from all when backsync disabled
        if (response.backSync == false) {
          if (response.hasOwnProperty('fullSync') && response.fullSync) {
            removeFromAll = true;
          }
        }

        flags[APLLICATION_RECORD.EVENT.remoteId] = response.backSync;
        setToken('back-sync', JSON.stringify(flags));

        // update user
        APLLICATION_RECORD.CURRENT_USER.backSync = response.backSync;
        // userDao.updateRow(
        //   { back_sync: response.backSync ? 1 : 0 },
        //   APLLICATION_RECORD.CURRENT_USER.id,
        // );
      }

      // process records
      initialStateSyncService.serverTimestamp = response.timestamp;

      if (removeFromAll) {
        return formDao
          .removeUserFromAll(APLLICATION_RECORD.EVENT.id)
          .then(async res => {
            // alert(res)
            processServerRecords(response.records);
            if (response.hasOwnProperty('deleted')) {
              let resone = await deleteServerRecords(response.deleted);
              // alert(resone)
              return Promise.resolve(resone);
              //   return Promise.resolve(deleteServerRecords(
              //     response.deleted
              //   ));
            }
            // return processServerRecords( response.records  ).then(() => {
            //     if (response.hasOwnProperty("deleted")) {
            //         return Promise.resolve(deleteServerRecords(
            //             response.deleted
            //         ));
            //     }
            // });
          });
      } else {
        processServerRecords(response.records);
        if (response.hasOwnProperty('deleted')) {
          let resone = await deleteServerRecords(response.deleted);
          // alert(resone)
          return Promise.resolve(resone);
          //   return Promise.resolve(deleteServerRecords(
          //     response.deleted
          //   ));
        }
        // return processServerRecords(response.records).then(
        //     () => {
        //         if (response.hasOwnProperty("deleted")) {
        //             return Promise.resolve(deleteServerRecords(
        //                 response.deleted
        //             ));
        //         }
        //     }
        // );
      }
    } catch (error) {
      return Promise.resolve(error);
    }
  } else {
    return Promise.resolve('error');
  }
};

export const deleteServerRecords = async deleted => {
  if (Array.isArray(deleted) && !deleted.length) {
    return Promise.resolve(true);
  }

  return await formDao
    .getLocalFormIds(APLLICATION_RECORD.APP_EVENT_ID)
    .then(async map => {
      let promises = [];
      for (let formId in deleted) {
        if (deleted.hasOwnProperty(formId) && map.hasOwnProperty(formId)) {
          promises.push(
            await formDao.markRecordsAsDeletedByGuid(
              map[formId],
              deleted[formId],
            ),
          );
        }
      }
      return Promise.all(promises); //.then(() => { });
    });
};

/**
 * Process records received from server, one after another
 * @param records
 * @returns {Promise<>}
 */
export const processServerRecords = records => {
  let index = -1;

  return new Promise((resolve, reject) => {
    const getNext = () => {
      if (++index >= records.length) {
        //this.addTiming("processServerRecords");
        return resolve();
      }

      let record = records[index];
      processServerRecord(record).then(res => {
        getNext();
      });
    };

    getNext();
  });
};

/**
 * Process record received from server
 * @param  record
 * @returns {Promise<>}
 */
export const processServerRecord = async record => {
  return await formDao
    .insertOrUpdateRecord(record)
    .then(result => {
      //  console.log("insertOrUpdateRecord() result processServerRecord", result, record);
      // downloadFiles2(result.formId, result.recordId, record);
      if (record.collections && typeof record.collections == 'object') {
        const morePromises = [];
        for (let collField in record.collections) {
          if (!record.collections.hasOwnProperty(collField)) {
            continue;
          }

          let p = formDao
            .deleteCollectionByRecordId(
              result.formId,
              collField,
              result.recordId,
            )
            .then(async () => {
              // insert new data
              let data = record.collections[collField];
              return await formDao
                .saveCollectionData(
                  result.formId,
                  collField,
                  result.recordId,
                  data,
                )
                .then(() => {
                  return true;
                  //Error // Error
                  // do this later
                  //   downloadFiles2(
                  //     result.formId,
                  //     result.recordId,
                  //     record,
                  //     collField,
                  //   );
                });
            });
          morePromises.push(p);
        }
        return Promise.all(morePromises);
      }
    })
    .catch(reason => {
      Promise.all(reason);
      // console.log("insertOrUpdateRecord() failed:", reason);
    });
};

export const getEmployeeData = async () => {
  // pull from server
  //const url = Config.EMPLOY_URL+"?user="+MyApp.currentUser.username+"&_dc="+new Date().getTime();
  //console.log('call api getEmployeeData')
  const url =
    API_ENDPOINTS.employeeList +
    '?user=' +
    APLLICATION_RECORD.CURRENT_USER.username +
    '&eventid=' +
    APLLICATION_RECORD.APP_EVENT_ID +
    '&_dc=' +
    new Date().getTime();
  const headers = {
    //'X-AUTH-TOKEN': APLLICATION_RECORD.CURRENT_USER.token || '',
  };
  const token = APLLICATION_RECORD.CURRENT_USER.token;
  const resp = await formServices.getEmployeeDataActionService(url, token);
  // let data = JSON.stringify(resp);
  // console.log('response api getEmployeeData', data)
  let list = [];
  try {
    if (resp.data && resp.data.success) {
      list = resp.data.list;
    } else {
      // console.log("getEmployeeData() failed", resp.data);
    }

    for (let i = 0; i < list.length; ++i) {
      let cur = list[i];
      if (cur.userImage && cur.userImage.data) {
        let filename = 'user-image-' + cur.id + '.' + cur.userImage.extension;
        try {
          cur.userImage = await utility.saveImageFromBase64(
            'images',
            filename,
            cur.userImage.data,
          );
        } catch (e) {
          // console.log(e);
          cur.userImage = null;
        }
      } else {
        cur.userImage = null;
      }
    }

    try {
      let responseData = await employeeDao.initTable(list);
      // alert(responseData)
      return responseData;
    } catch (e) {
      //  console.log(e);
      return null;
    }
  } catch (e) {
    //console.log(e);
  }
};

export const getFormListTile = () => {
  return formDao
    .getList(APLLICATION_RECORD.APP_EVENT_ID)
    .then(forms => {
      initialStateSyncService.currentForms = forms;

      const promises = [];
      for (let i = 0; i < forms.length; ++i) {
        promises.push(forms[i]);
      }

      return Promise.all(promises).then(result => {
        let master = [];
        for (let i = 0; i < result.length; ++i) {
          master = master.concat(result[i]);
        }
        //this.addTiming("getFormData");
        return master;
      });
    })
    .catch(reason => {});
};

export const modificationCount = formIds => {
  return formDao
    .getModifiedCounts(APLLICATION_RECORD.APP_EVENT_ID, formIds)
    .then(counts => {
      return uploadDao
        .getFilesForUpload(APLLICATION_RECORD.APP_EVENT_ID, formIds)
        .then(uploads => {
          return {upload: uploads.length, modifiedCounts: counts};
        });
    });
};

export const getModifiedCountsDrafts = (formIds = []) => {
  return formDao
  .getModifiedCountsForDraft(APLLICATION_RECORD.APP_EVENT_ID, formIds, 1)
  .then(counts => {
        return {modifiedCounts: counts};
  });
}

/**
 * Download images for records
 * @param  formId
 * @param  recordId
 * @param  record
 * @param  collectionField
 */
export const downloadFiles2 = (
  formId,
  recordId,
  record,
  collectionField = null,
) => {
  const downloadToCollection = (collId, filename, column) => {
    downloadImage(record, filename).then(
      filepath => {
        if (filepath === null) {
          return;
        }
        // update collection record
        let bind = {
          id: collId,
        };
        bind[column] = filepath;
        //  console.log("Download image OK, updating collection", bind);
        formDao.saveCollectionData(formId, collectionField, recordId, [bind]);
      },
      error => {
        // console.log("Image download failed", error);
      },
    );
  };

  const downloadToRecord = (filename, column) => {
    downloadImage(record, filename).then(
      filepath => {
        if (filepath === null) {
          return;
        }

        // update record
        let eventId = APLLICATION_RECORD.APP_EVENT_ID;
        let bind = {
          id: recordId,
        };
        bind[column] = filepath;
        // console.log("Download image OK, updating record", bind);
        formDao.saveFormData(formId, eventId, recordId, bind, false);
      },
      error => {
        //  console.log("Image download failed", error);
      },
    );
  };

  if (collectionField) {
    formDao
      .getCollectionData(formId, collectionField, recordId)
      .then(records => {
        records.forEach(record => {
          for (let column in record) {
            let v = record[column];
            if (
              typeof v == 'string' &&
              (v.indexOf('server://') == 0 || v.indexOf('/RecordsPhotos/') == 0)
            ) {
              // denotes a file on the server - download it
              let filename = v.substr(v.lastIndexOf('/') + 1);
              downloadToCollection(record.id, filename, column);
            }
          }
        });
      });
  } else {
    for (let column in record.data) {
      let v = record.data[column];
      //console.log('record.data', v)
      if (
        typeof v == 'string' &&
        (v.indexOf('server://') == 0 || v.indexOf('/RecordsPhotos/') == 0)
      ) {
        // denotes a file on the server - download it
        let filename = v.substr(v.lastIndexOf('/') + 1);
        downloadToRecord(filename, column);
      }
    }
  }
};

/**
 * Download single record image
 * @param record
 * @param filename
 * @returns {Promise<string>}
 */
export const downloadImage = (record, filename) => {
  let url =
    API_ENDPOINTS.getImage +
    '?record_id=' +
    record.record_id +
    '&filename=' +
    encodeURIComponent(filename);
  //console.log("downloadImage()", url);
  const dataDir =
    RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath;
  const destination =
    dataDir +
    'event_' +
    record.event_id +
    '/form_' +
    record.form_id +
    '/' +
    filename;
  // let fileExitOrNot = RNFS.exists(destination);
  // if(fileExitOrNot) {
  //     console.log(fileExitOrNot)
  // } else {
  //     console.log(fileExitOrNot)
  // }
  const headers = {
    //'X-AUTH-TOKEN': APLLICATION_RECORD.CURRENT_USER.token || '',
  };

  RNFS.exists(destination)
    .then(success => {
      if (success) {
        return destination;
      } else {
        RNFS.downloadFile({
          fromUrl: url,
          toFile: destination,
          headers: headers,
        }).promise.then(r => {
          // console.log('file',r)
          return destination;
        });
      }
    })
    .catch(err => {
      // console.log(err.message, err.code);
    });
};

export const getWaitlist = async data => {
  // console.log('submitFormDataAction', data)
  try {
    const token = APLLICATION_RECORD.CURRENT_USER.token;
    const response = await formServices.getWaitlistRecord(
      APLLICATION_RECORD.APP_EVENT_ID,
      token,
    );
    let result = JSON.stringify(response);
    console.log('result', result);
    if (response?.status === 200 && response?.data?.success) {
      // let res = await formDao.setRemoteRecordIds(
      //   response.data.data,
      //   response.syncDate,
      // );
      return Promise.all(res);
    } else {
      return null;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

export const downloadImagesOnDemand =  async (list, params) => {

  const token = APLLICATION_RECORD.CURRENT_USER.token;
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token;

let error = false;
const pathList = await RNFS.readDir(RNFS.DocumentDirectoryPath);
for (let i = 0; i < list.length; ++i) {
    const cur = list[i];
    const filename = cur.value.substr(cur.value.lastIndexOf('/')+1);
   // const url = API_ENDPOINTS.getImage + "?record_id=" + '3678412' + "&filename=" + 'ac206741-adc1-43b5-ad66-eb10503b4237.jpg';
     const url = API_ENDPOINTS.getImage + "?record_id=" + params.remoteRecordId + "&filename=" + filename;
    const dataDir = RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath;
    // const destination = dataDir + "event_" + params.remoteEventId + "/form_" + params.remoteFormId + "/" + filename;
    const destination =  `${RNFS.DocumentDirectoryPath}` +'/'+filename ; //dataDir +'/'+ filename;

    console.log(url, destination)
    try {
         

        const fileEntry = await RNFS.downloadFile({fromUrl:url, toFile: destination,headers: config.headers} ).promise; 
        if(fileEntry){ 
          
         console.log(fileEntry)

        //  fileEntry.promise
        //  .then(async res => {
        //    if (res && res.statusCode === 200 && res.bytesWritten > 0) {
        //      console.log('size:', res.bytesWritten);
        //    } else {
        //      console.log(res);
        //    }
        //  })
        //  .catch(error => console.log(error));
         // const newPath = normalizeURL(fileEntry.toURL());
        } 
       //file:///storage/emulated/0/Android
       //  const fileEntry: FileEntry = await fileTransfer.download(url, destination, true, options);
        const newPath = destination //normalizeURL(fileEntry.toURL());
        console.log('Image downloaded', {old: cur.value, new: newPath});

        let res;
        if (cur.collection){
            res = await formDao.searchReplaceCollection(params.formId, cur.collection, params.recordId, cur.field, cur.value, newPath);
        } else {
            const row = {};
            row[cur.field] = newPath;
            res = await formDao.updateRow(row, params.recordId, 'form_data_' +  params.formId);
        }
        // console.log('Affected rows', res.rowsAffected);

    } catch (e) {
        console.log('downloadImagesOnDemand error', e);
        error = true;
        break;
    }
}

return error === false;

} 
