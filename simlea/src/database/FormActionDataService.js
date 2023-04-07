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
import * as syncService from '../database/SyncService';
import * as eventDAO from '../database/Tables/eventDAO';
import {API_ENDPOINTS, API_ENDPOINT_BASE_URL} from '../constants/constants';
import {NativeModules, Alert, Image} from 'react-native';
import RNFS from 'react-native-fs';
import {getToken, setToken} from '../Utilities/util';
import {SaveFormConfirmation} from '../components';
import {useState} from 'react';
import {source} from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const initState = {
  _inputsFlat: {},
  _invalidElements: {},
  validationErrors: [],
  _fields: {},
  _formData: {},
  _currentRecordId: '',
};

export const initElements = (record, fields) => {
  initState._formData = fields;
  initState._fields = JSON.parse(fields.elements);
  initState._inputsFlat = {};
  initState._invalidElements = {};
  initState.validationErrors = [];
  const recurseElements = (element, parent) => {
    // reset flag
    element['wasInitialized'] = false;
    element['errorMessage'] = '';
    element['invalid'] = false;
    element['invalidChildren'] = false;
    element.triggers = [];
    delete element.dependendFields;
    element._parent = parent ? parent : null;

    if (element.name && element.name.length) {
      initState._inputsFlat[element.name] = element;
    }

    switch (element.type) {
      case 'collection':
        initCollection(record, element);
        break;
      default:
        break;
    }

    if (element.hasOwnProperty('children') && Array.isArray(element.children)) {
      for (let i = 0; i < element.children.length; ++i) {
        recurseElements(element.children[i], element);
      }
    }
  };
  initState._fields.forEach(recurseElements);
  linkDependendFields();
  setupTriggers();
};

export const initElements1 = (record, fields) => {
  initState._formData = fields;
  initState._fields = JSON.parse(fields.elements);
  initState._inputsFlat = {};
  initState._invalidElements = {};
  initState.validationErrors = [];
  const recurseElements = (element, parent) => {
    // reset flag
    element['wasInitialized'] = false;
    element['errorMessage'] = '';
    element['invalid'] = false;
    element['invalidChildren'] = false;
    element.triggers = [];
    delete element.dependendFields;
    element._parent = parent ? parent : null;

    if (element.name && element.name.length) {
      initState._inputsFlat[element.name] = element;
    }

    switch (element.type) {
      case 'collection':
        initCollection(record, element);
        break;
      default:
        break;
    }

    if (element.hasOwnProperty('children') && Array.isArray(element.children)) {
      for (let i = 0; i < element.children.length; ++i) {
        recurseElements(element.children[i], element);
      }
    }
  };
  initState._fields.forEach(recurseElements);
  linkDependendFields();
  setupTriggers();

  const recurseElementsAssignData = (element, parent) => {
    if (element['type'] == 'user') {
      // // console.log("Init user element");
      element['users'] = [];
      employeeDao.getData().then(list => {
        //// console.log("Init user element employeeDao ", list);
        let users = [];
        let values = [];
        list.forEach(item => {
          let fullname = item.lastname + ', ' + item.firstname;
          let forms =
            item.forms && item.forms.length ? item.forms.split(',') : [];
          if (item.id != APLLICATION_RECORD.CURRENT_USER.remoteId) {
            if (
              forms.indexOf(APLLICATION_RECORD.FORM.remoteId.toString()) == -1
            ) {
              // current form is not assigned to this user
              return;
            }
          }
          if (values.indexOf(fullname) == -1) {
            values.push(fullname);
            users.push({
              text: fullname,
              value: item.firstname + ' ' + item.lastname,
              userId: item.id,
              email: item.email,
              selected: false,
            });
          }
        });
        users.sort((a, b) => {
          return a.text.localeCompare(b.text);
        });
        element['users'] = users;
      });
      if (!element['value']) {
        element['value'] =
          APLLICATION_RECORD.CURRENT_USER.firstname +
          ' ' +
          APLLICATION_RECORD.CURRENT_USER.lastname;
        element['selectedUserId'] = APLLICATION_RECORD.CURRENT_USER.remoteId;
        APLLICATION_RECORD.FORM['selectedUserId'] =
          APLLICATION_RECORD.CURRENT_USER.remoteId;
        APLLICATION_RECORD.FORM['selectedUserEmail'] =
          APLLICATION_RECORD.CURRENT_USER.email;
      }
    }
    if (element.hasOwnProperty('children') && Array.isArray(element.children)) {
      for (let i = 0; i < element.children.length; ++i) {
        recurseElementsAssignData(element.children[i], element);
      }
    }
  };

  initState._fields.forEach(recurseElementsAssignData);

  return initState._fields;
};

export const linkDependendFields = () => {
  for (let i in initState._inputsFlat) {
    if (initState._inputsFlat.hasOwnProperty(i)) {
      updateRequired(initState._inputsFlat[i], true);
    }
  }
};

export const updateRequired = (element, link = false, data = null) => {
  if (element.config) {
    let config = element.config;
    if (config.required) {
      let req = config.required;
      switch (req.type) {
        case 'field':
          let other = initState._inputsFlat[req.target];
          if (other) {
            if (link) {
              other.dependendFields = other.dependendFields || [];
              other.dependendFields.push(element);
              // console.log("Dependend fields", other);
            }
            let value = getElementValue(other);
            if (data && data.hasOwnProperty(req.target)) {
              value = data[req.target];
            }
            // console.log("updateRequired()", element.name, value);
            if (req.comp == 'empty') {
              element.required = !value || !value.length;
            } else if (req.comp == 'notempty') {
              element.required = value && value.length;
            }
          }
          break;
        default:
          break;
      }
    }
  }
};

export const getElementValue = element => {
  if (element.type == 'checkbox') {
    if (element.options && element.options.length) {
      let values = [];
      for (let i in element.options) {
        let cur = element.options[i];
        if (cur.selected) {
          values.push(cur.value);
        }
      }
      return values.join(',');
    }
  }

  return element.value || '';
};

export const setupTriggers = () => {
  const recurseElements = element => {
    if (element.config && element.config.visible) {
      let vis = element.config.visible;
      if (vis.target) {
        let target = initState._inputsFlat[vis.target];
        if (target) {
          target.triggers.push({
            targetId: element.id,
            type: 'visible',
            comp: vis.comp,
            value: vis.value,
          });
        }
      }
    }

    if (element.hasOwnProperty('children') && Array.isArray(element.children)) {
      for (let i = 0; i < element.children.length; ++i) {
        recurseElements(element.children[i]);
      }
    }
  };
  initState._fields.forEach(recurseElements);
};

export const initCollection = (record, element) => {
  // console.log("Init collection", element);
  if (record.id) {
    element['items'] = [];
    formDao
      .getCollectionData(initState._formData.id, element['name'], record.id)
      .then(items => {
        // console.log("Init collection", items);
        if (items && items.length) {
          element['items'] = items;
          fillForm(element['children'], items[0], true);
          // MyApp.currentForm.updateDependend(element);
        } else {
          element['items'] = [getDefaults(element['children'])];
        }
      });
  } else {
    element['items'] = [getDefaults(element['children'])];
  }
  element['activeTab'] = 0;
};

export const getDefaults = formElements => {
  const elementSerializer = (element, result) => {
    if (element.children && element.children.length) {
      element.children.forEach(el => elementSerializer(el, result));
    } else if (element.name && element.name.length) {
      result[element.name] = element.default || '';
    }
  };

  const result = {};
  if (Array.isArray(formElements)) {
    formElements.forEach(el => elementSerializer(el, result));
  }
  return result;
};

export const getRecordList = async (props, fromData) =>
  new Promise(async (resolve, reject) => {
    let form = fromData;
    initState._currentRecordId = props.id;
    await formDao.getRecord(form.id, props.id).then(record => {
      // if (MyApp.currentUser.draftMode && record["draft"]){
      //     this.canSaveAsDraft = true;
      // }
      //// console.log('record data ',record)
      form.selectedUserId = record['selected_user_id'];
      form.waitlistUserId = record['waitlist_user_id'];
      fill(record, true, form);
      // form.fill(record, true);
      // this.leadId = record["lead_id"];
      form.contactChecked = record['contact_checked'] == 1;

      ////console.log('record data formformform',initState._fields)
      initState._fields.forEach(element => {
        // // console.log(element.children[0]._parent.children)
        let res = element.children;
        ////console.log(res)
      });

      const missing = getMissingImages();
      console.log('missing image =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',missing)
      if(missing?.length > 0) {
        const params = {
          formId: form.id,
          remoteFormId: form.remoteId,
          eventId: APLLICATION_RECORD.EVENT.eventId,
          remoteEventId: APLLICATION_RECORD.EVENT.eventId,
          recordId: props.id,
          remoteRecordId: record["remote_id"]
      };

      syncService.downloadImagesOnDemand(missing, params).then(success => {
        // if (!success) {
        //     const alert = this.alertCtrl.create({
        //         title: this.translate.instant('pages.form.missing-images'),
        //         message: 'Download war nicht erfolgreich. Bitte sicherstellen, dass eine Internetverbindung besteht.',
        //         buttons: [{
        //             text: this.translate.instant("general.ok")
        //         }]
        //     });
        //     alert.present();
        // } else {
            // reload
            console.log('Reload!');
            
            // this.form.initElements();
            // this.ionViewDidEnter(true);
       // }
    });
      }
      console.log('missing image params =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',APLLICATION_RECORD.EVENT)
      console.log('missing image params =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',initState._fields)

     

      resolve(initState._fields);
      //// console.log("Record loaded", record);
      //// console.log("Form elements", form);
      // this.noEdit = false;
      // this.loading = false;

      // if (!reloaded && localStorage.getItem('download-on-demand') === '1'){
      //     const missing = form.getMissingImages();
      //    // console.log('missing images', missing);

      //     if (missing.length){
      //         // ask for image download
      //         const alert = this.alertCtrl.create({
      //             title: this.translate.instant('pages.form.missing-images'),
      //             message: this.translate.instant('pages.form.download-images'),
      //             buttons: [{
      //                 text:  this.translate.instant("general.yes"),
      //                 handler: () => this.downloadMissingImages(missing, record["remote_id"])
      //             },{
      //                 text:  this.translate.instant("general.no"),
      //                 role: 'cancel'
      //             }]
      //         });
      //         alert.present();
      //     }
      // }
    });
  });



  export const getMissingImages = () => {
    const r = getTypesAndValues();
    let imageFields = [];
    const missing = [];

    for (const type in r.types){
        if (type == 'photo' || type == 'card'){
            imageFields = imageFields.concat(r.types[type]);
        }
    }

    imageFields.forEach(field => {
        let v = r.values[field];

        if (!Array.isArray(v)){
            v = [v];
        }

        v.forEach(value => {
            if (typeof value === 'string'){
                if (value.startsWith('/RecordsPhotos/') || value.startsWith('server://')){
                    missing.push({
                        field: field,
                        value: value,
                        collection: r.collections[field] || null
                    });
                }
            }
        });

    });

    return missing;
}

export const getTypesAndValues = () => {
  const values = {};
  const types = {};
  const collections = {};

  for (const i in initState._inputsFlat){
      const cur = initState._inputsFlat[i];

      // get types
      types[cur.type] = types[cur.type] || [];
      types[cur.type].push(cur.name);

      // get values
      if (cur.type === 'collection'){
          cur.items.forEach(item => {
              for (const name in item){
                  if (!item.hasOwnProperty(name)){
                      continue;
                  }
                  if (name == 'id' || name == 'record_id'){
                      continue;
                  }
                  if (!Array.isArray(values[name])){
                      values[name] = [];
                  }
                  values[name].push(item[name]);
                  collections[name] = cur.name;
              }
          });
      } else {
          if (!Array.isArray(values[cur.name])){
              values[cur.name] = cur.value;
          }
      }
  }

  return {
      types: types,
      values: values,
      collections: collections
  };
}


export const fill = (
  data,
  update = false,
  form,
  markAsModified = false,
  noOverwrite = false,
) => {
  if (markAsModified) {
    // this.hasChanges = true;
  }
  // let parseForm = JSON.parse(form.elements)
  fillForm(initState._fields, data, update, noOverwrite);
  ////console.log('new record of from ', datarecord)
};

export const fillForm = (
  formElements,
  data,
  update = false,
  noOverwrite = false,
) => {
  const fillElement = (element, data) => {
    if (!update) {
      element.disabled = true;
    }

    if (!data) {
      return;
    }

    if (element.type == 'collection') {
      return;
    }

    //// console.log('element.type',element.type)
    //// console.log('element.hasOwnProperty children',element.hasOwnProperty('children'))
    //// console.log("element.hasOwnProperty value", element.hasOwnProperty('value'))
    ////console.log("data.hasOwnProperty(element.name)",element.type, data.hasOwnProperty(element.name))
    if (element.type == 'select' || element.type == 'checkbox') {
      if (data.hasOwnProperty(element.name)) {
        let v = data[element.name];
        let values = [];

        if (typeof v == 'string') {
          values = v.split(',');
        } else if (Array.isArray(v)) {
          values = v;
        }

        if (element.type == 'select') {
          element.value = '';
        }

        for (let i in element.options) {
          let opt = element.options[i];
          opt.selected = values.indexOf(opt.value) != -1;
          if (opt.selected && element.type == 'select') {
            element.value = opt.value;
          }
        }
      }
    } else if (element.hasOwnProperty('children')) {
      element.children.forEach(el => fillElement(el, data));
    } else if (element.hasOwnProperty('value')) {
      if (noOverwrite && element.value && element.value.length) {
        return;
      }
      if (data.hasOwnProperty(element.name)) {
        element.value = data[element.name];

        if (element.type == 'signature') {
          if (typeof element.resetFunc == 'function') {
            //element.resetFunc();
          }
          element.signatureData = null;
          if (
            typeof element.value == 'string' &&
            element.value.substring(0, 5) == 'data:'
          ) {
            element.hasValue = true;
          } else {
            element.hasValue = false;
          }
        }

        if (element.type == 'copytome' || element.type == 'sendmail') {
          if (!element.value) {
            element.value = false;
          }
        }

        if (element.type == 'sendleadto') {
          //Form.populateEmployees(element);
          // Form.populateSendLeadTo(element);
        }

        if (element.type == 'user') {
          if (data[element.name] == '') {
            // console.log("Clearing user element");
            element.selectedUserId = null;
            // MyApp.currentForm.selectedUserId = null;
            // MyApp.currentForm.selectedUserEmail = null;
          } else {
            // console.log("Populating user element", element.users, APLLICATION_RECORD.FORM, APLLICATION_RECORD.CURRENT_USER);
            // if(element.selectedUserId === undefined && APLLICATION_RECORD.FORM.remoteId) {
            //     APLLICATION_RECORD.FORM['selectedUserId'] = APLLICATION_RECORD.FORM.remoteId;
            // }
            if (
              APLLICATION_RECORD.FORM &&
              APLLICATION_RECORD.FORM.selectedUserId
            ) {
              element.selectedUserId = APLLICATION_RECORD.FORM.selectedUserId;
              for (let i = 0; i < element.users.length; ++i) {
                let cur = element.users[i];
                if (cur.userId == element.selectedUserId) {
                  // console.log('Setting user email', cur.email);
                  APLLICATION_RECORD.FORM['selectedUserEmail'] = cur.email;
                  break;
                }
              }
            }
          }
        }
      }
    } else if (data.hasOwnProperty(element.name)) {
      element.value = data[element.name];
      if (element.type == 'copytome' || element.type == 'sendmail') {
        if (!element.value) {
          element.value = false;
        }
      }
      // console.log("Form fill using fallback %s = %s", element.name, element.value);
    }

    // MyApp.currentForm.fireTriggers(element);
  };
  //alert(JSON.stringify(formElements))
  formElements.forEach(el => fillElement(el, data));
  ////console.log('finalData ', JSON.stringify(formElements))
};

export const getEmployeeList = async () =>
  new Promise(async (resolve, reject) => {
    let empList = await employeeDao.getData();
    resolve(empList);
  });

export const getSuperSelectRecord = async props =>
  new Promise(async (resolve, reject) => {
    let query = '';

    let limits = {
      limit: 20,
      offset: 0,
    };
    if (props.elements[0].objektId == 'employee') {
      let remoteFormId = props.elements[0].id;
      let res = await receiverDao.getData(remoteFormId, query, limits);
      resolve(res);
    } else {
      if (props.elements[0].viewColumns != undefined) {
        let searchColumns = props.elements[0].viewColumns;
        ////console.log(props  objektId)
        let res = await superDao.getData(
          props.elements[0].objektId,
          searchColumns,
          query,
          limits,
        );
        resolve(res);
        // await superDao.getData(props.elements[0].objektId, searchColumns, query, limits).then(processResult, error => {
        //    // console.log("SuperSelect getData Failed!", error);
        // });
      }
    }

    const processResult = items => {
      // alert(JSON.stringify(items))
      resolve(items);
      // if (infiniteScroll){
      //     this.items = this.items.concat(items);
      //    // console.log('Async operation has ended');
      //     if (items.length < this.limit){
      //         // no more records to load
      //        // console.log("Disable infinite scroll");
      //         infiniteScroll.enable(false);
      //     }
      //     infiniteScroll.complete();
      // } else {
      //     this.items = items;
      //     this.content.scrollToTop(0);
      //     // re-enable infinite scroll
      //     if (this.infiniteScroll && items.length >= this.limit){
      //        // console.log("Enable infinite scroll");
      //         this.infiniteScroll.enable(true);
      //     }
      // }
    };
  });

export const checkSave = async (
  formDataAllFields,
  record,
  form,
  draftIsTrue,
) => {
  //// console.log('formDataAllFields',formDataAllFields)
  //// console.log('record',record)
  //// console.log('form',form)

  //await eventDAO.getSingleEventListByEventId(APLLICATION_RECORD.FORM.eventId);

  const deletedCollections = {};
  const collectionData = getCollectionData(
    deletedCollections,
    formDataAllFields,
  );

  const dupes = [];
  const formData = toJson(dupes, formDataAllFields);

  // console.log("FormData", formData);
  // console.log("Collection Data", collectionData);
  // console.log("Deleted Collections", deletedCollections);
  // console.log("Dupes", dupes);

  // check new record form details
  let newRecordFormDetails = APLLICATION_RECORD.FORM;
  if (form === undefined) {
    newRecordFormDetails['elements'] = formDataAllFields;
    form = newRecordFormDetails;
  }

  formData['lead_lang'] =
    APLLICATION_RECORD.FORM.currentLanguage ||
    APLLICATION_RECORD.FORM.defaultLanguage ||
    '';
  formData['contact_checked'] = APLLICATION_RECORD.FORM.contactChecked ? 1 : 0;
  formData['selected_user_id'] = APLLICATION_RECORD.FORM.selectedUserId || '';
  // if (saveAsDraft){
  //     formData["waitlist_user_id"] = this.form.waitlistUserId;
  // }
  formData['draft'] = draftIsTrue;

  console.log('formData', formData)
  console.log('collectionData', collectionData)
  console.log('record', record)
  console.log('form', form)
  console.log('======================================')
  // console.log('leradid ',await utility.getLeadId1())

  return wasModified(formData, collectionData, record, form).then(
    wasModified => {
      if (wasModified) {
        let recordId = null;
        if (record) {
          recordId = record.id;
        }
        let res = save(
          formData,
          collectionData,
          deletedCollections,
          form,
          recordId,
        );
        return res;
      } else {
        // just leave
      } 
    },
  );
};

export const save = (
  formData,
  collectionData,
  deletedCollections,
  form,
  isrecordId,
) => {
  // alert('save page method'+APLLICATION_RECORD.APP_EVENT_ID)
  let eventId = APLLICATION_RECORD.APP_EVENT_ID;
  formDao.saveFormData(form.id, eventId, isrecordId, formData).then(
    res => {
      //alert('saveFormData res', res)
      let recordId = isrecordId ? isrecordId : res; // res?.insertId; latest changes fun when save fun
      let promises = [];

      let p = uploadDao.addFilesFromRecord(form, recordId, 0, formData);
      promises.push(p);

      for (let name in collectionData) {
        let p = formDao.saveCollectionData(
          form.id,
          name,
          recordId,
          collectionData[name],
        );
        promises.push(p);
        let arr = collectionData[name];
        for (let i = 0; i < arr.length; ++i) {
          let p = uploadDao.addFilesFromRecord(form, recordId, i + 1, arr[i]);
          promises.push(p);
        }
      }
      // for (let name in deletedCollections){
      //     let p = formDao.deleteCollectionData(form.id, name, deletedCollections[name]);
      //     promises.push(p);
      // }
      return Promise.all(promises).then(
        async () => {
          Alert.alert('Saved', 'A new record has been saved.', [
            {
              text: 'OK',
            },
          ]);

          // send single record to server
          // if (this.fromWaitlist || MyApp.currentUser.draftMode){
          await sendRecordToServer(form, recordId);
          // } else {
          // this.sendRecordToWebSocket(recordId);
          // }

          // if (this.recordId){
          //     this.navCtrl.pop().then(() => {
          //         this.events.publish('record-update');
          //         return this.checkReopenPage(recordId);
          //     });
          // } else {
          //     this.navCtrl.setRoot(DashboardPage).then(() => {
          //         return this.checkReopenPage(recordId);
          //     });
          // }
        },
        error => {
          // console.error("Save collection data failed", error);
        },
      );
    },
    error => {
      // console.error("Save form data failed", error);
    },
  );
};

export const sendRecordToServer = async (form, recordId) => {
  try {
    const records = await syncService.buildRecords1(form, recordId);
    console.log('records', records)
    await syncService.submitFormDataAction(records);
    await syncService.submitImagesNew(false, form.id, recordId);
    const record = await formDao.getRecord(form.id, recordId);
    // console.log('sendRecordToServer() updated record', record);
  } catch (e) {
    // console.log('sendRecordToServer() error', e);
  }
};

export const wasModified = (newData, collectionData, record, form) => {
  if (!record?.id) {
    // console.log("wasModified: no record id => new record");
    return Promise.resolve(true);
  }
  return formDao.getRecord(form.id, record.id).then(oldData => {
    // console.log("wasModified", oldData, newData);

    for (let i in newData) {
      if (!newData.hasOwnProperty(i)) {
        continue;
      }
      if (!oldData.hasOwnProperty(i)) {
        // console.log("value changed %s: nothing => %s", i, newData[i]);
        return true;
      }
      let newValue = newData[i];
      let oldValue = oldData[i];

      if (Array.isArray(newValue)) {
        // console.log(newValue)
        newValue = newValue.join(',');
      }

      if (newValue != oldValue) {
        // console.log("value changed %s: %s => %s", i, oldValue, newValue);
        return true;
      }
    }

    const promises = [];
    for (let i in collectionData) {
      if (!collectionData.hasOwnProperty(i)) {
        continue;
      }
      let p = compareCollection(i, collectionData[i], form, record);
      promises.push(p);
    }
    return Promise.all(promises).then((arr = []) => {
      return arr.indexOf(true) != -1;
    });
  });
};

export const compareCollection = (field, newData, form, record) => {
  return formDao.getCollectionData(form.id, field, record).then(oldData => {
    ////console.log("compare collection", oldData, newData);
    if (oldData.length != newData.length) {
      // console.log("collection %s changed in length %s => %s", field, oldData.length, newData.length);
      return true;
    }

    for (let i = 0; i < newData.length; ++i) {
      let newRec = newData[i];
      let oldRec = oldData[i];

      for (let j in newRec) {
        if (!newRec.hasOwnProperty(j)) {
          continue;
        }
        if (!oldRec.hasOwnProperty(j)) {
          // console.log("collection value %s changed %s: nothing => %s", field, j, newRec[j]);
          return true;
        }
        let newValue = newRec[j];
        let oldValue = oldRec[j];

        if (Array.isArray(newValue)) {
          newValue = newValue.join(',');
        }

        if (newValue != oldValue) {
          // console.log("collection value %s changed %s: %s => %s", field, i, oldValue, newValue);
          return true;
        }
      }
    }

    return false;
  });
};

export const getCollectionData = (deleted = null, _fields) => {
  let result = {};
  const recurseElements = element => {
    if (element.type == 'collection') {
      // save current active tab
      let idx = element.activeTab;
      if (element.items.length > idx) {
        let id = element.items[idx]['id'];
        // element.items[idx] = elements2json(element.children);
        if (id) {
          element.items[idx]['id'] = id;
        }
      }
      result[element.name] = element.items;
      if (deleted && element.deleted && element.deleted.length) {
        deleted[element.name] = element.deleted;
      }
    } else if (element.hasOwnProperty('children')) {
      element.children.forEach(recurseElements);
    }
  };
  _fields.forEach(recurseElements);
  // console.log("getCollectionData()", result);
  return result;
};

export const toJson = (dupes = [], _fields) => {
  return elements2json(_fields, dupes);
};

export const elements2json = (formElements = [], dupes = []) => {
  const elementSerialiser = (element, result) => {
    if (element.type == 'collection') {
      // children of collections must be processed separately
      return;
    }
    if (element.children && element.children.length) {
      // layout component
      element.children.forEach(el => elementSerialiser(el, result));
    } else if (element.name && element.name.length) {
      if (result.hasOwnProperty(element.name)) {
        // console.log("Duplicate name found %s", element.name);
        dupes.push(element.name);
      }
      if (element.type == 'photo' || element.type == 'card') {
        // only take file name
        let v = element.value;
        result[element.name] = v || '';
      } else if (element.type == 'select') {
        result[element.name] = element.value || '';
      } else if (element.options && element.options.length) {
        let values = [];
        for (let i in element.options) {
          let cur = element.options[i];
          if (cur.selected) {
            values.push(cur.value);
          }
        }
        result[element.name] = values;
      } else if (element.hasOwnProperty('value')) {
        // console.log('result[element.name]', result[element.name])
        // console.log('element.value', element.value)
        result[element.name] = element.value || '';
      }
    }
  };

  const result = {};
  formElements.forEach(el => elementSerialiser(el, result));
  return result;
};


export const getImagePathAndUploadItLocaly = (data) => {
  let ext = data.substring(data.lastIndexOf("."));
  if (!ext || !ext.length) {
      ext = ".jpg";
  }
  let dataDir = RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath;
  console.log(APLLICATION_RECORD.EVENT)
  let newPath =  dataDir + "/event_" +  APLLICATION_RECORD.EVENT.eventId +  "/form_" +  APLLICATION_RECORD.FORM.remoteId +  "/";
  let newName = utility.generateGuid() + ext;
  return saveTemporaryFile(data, newPath, newName).then(
    //return transfer.download(data, dataDir+filename,true).then(
    (fileEntry) => {
       // this.element["value"] = normalizeURL(fileEntry.toURL());
        console.log(
            "Photo saved under %s",
            fileEntry
        );
       // this.validate();
        return fileEntry;
    }
);

}

export const saveTemporaryFile = async (tempFile, newPath, newName) => {
  console.log(  "saveTemporaryFile(): %s => %s",  tempFile,  newPath + newName );

  try{ 
    const data = await RNFS.downloadFile({fromUrl:tempFile, toFile: newPath + newName} ).promise; 
    if(data){ 
      
     console.log(data)
    } 
    }
    catch(error){ console.log('error', error) }

  // RNFS.downloadFile({
  //   fromUrl: tempFile,
  //   toFile: newPath + newName,
  // }).promise.then((r) => {
  //   console.log('r', r)
  //    return r;
  // });

  // if (cordova.platformId == "android" || cordova.platformId == "ios") {
  //     let transfer = this.fileTransfer.create();
  //     return transfer.download(tempFile, newPath + newName, true);
  // }

  // return this.createPathIfRequired(newPath).then((targetDir) => {
  //     console.log("saveTemporaryFile() targetDir", targetDir);
  //     return this.file
  //         .resolveLocalFilesystemUrl(tempFile)
  //         .then((fileEntry) => {
  //             console.log("saveTemporaryFile() sourceFile", fileEntry);
  //             return new Promise((resolve, reject) => {
  //                 fileEntry.moveTo(targetDir, newName, resolve, reject);
  //             });
  //         });
  // });
}
