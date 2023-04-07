import RNFS from 'react-native-fs';
import { decode as atob } from 'base-64';
import { API_ENDPOINT_BASE_URL } from '../constants/constants';
import { APLLICATION_RECORD } from './Constants';
import * as DeviceInfo from 'react-native-device-info';
import { getToken } from '../Utilities/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Update event or company logo
 *  @returns {Promise<void>}
 */
export const updateLogo = async (event, key, logo) => {
  let hasLogo = logo && logo.data && logo.data.length;
  if (!hasLogo) {
    //console.log('No logo data');
    return;
  }

  const filename = 'event-' + key + '.' + logo.extension;
  event[key] = await saveImageFromBase64(
    'event_' + event.remote_id,
    filename,
    logo.data,
  );
  //console.log('event', event);
};

export const saveImageFromBase64 = async (targetFolder, fileName, data) => {
  //console.log(RNFS.DocumentDirectoryPath, RNFS.ExternalStorageDirectoryPath);
  const dataDir =
    RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath;
  let targetPath = dataDir + '/' + targetFolder;
  //console.log(
  // 'saveImageFromBase64 target file path: ' + targetPath + '/' + fileName,
  // );

  await createDirs(RNFS, dataDir, targetFolder);

  let blob = b64toBlob(data);
  const filePath = dataDir + '/' + targetFolder + '/' + fileName;
  // const entry = await RNFS.writeFile(filePath, data,'base64' );

  await RNFS.writeFile(filePath, data, 'base64')
    .then(success => {
      //console.log('FILE WRITTEN!');
    })
    .catch(err => {
      //console.error(err.message);
      //console.error(err);
    });

  // //console.log('file path : %s', entry)
  return dataDir + '/' + targetFolder + '/' + fileName;
  // return normalizeURL(entry.nativeURL) + "?_dc=" + new Date().getTime();
};

createDirs = (file, root, path) => {
  let parts = path.split('/');
  let check = [];

  //console.log('Create dir: ' + root + '/' + path);

  let checkDir = () => {
    if (!parts.length) {
      //console.log('Create dir finished');
      return Promise.resolve();
    }
    let cur = parts.shift();
    check.push(cur);
    let dir = check.join('/');
    let fileurl = root + '/' + dir;
    //let fileExists = file.existsAssets(fileurl);
    //  if(!fileExists) {
    makeDirectory(fileurl); //execute this function on first mount
    // }
  };

  return checkDir();
};

const makeDirectory = async folderPath => {
  await RNFS.mkdir(folderPath); //create a new folder on folderPath
};

b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  let byteCharacters = atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getLeadId = () => {
  let s1 = APLLICATION_RECORD.EVENT
    ? APLLICATION_RECORD.EVENT.shortCode
    : 'XX';
  if (APLLICATION_RECORD.FORM) {
    let short = APLLICATION_RECORD.FORM.shortCode;
    if (short && short.length) {
      s1 += '-' + short;
    }
  }

  let s2 = getToken('device-num');
  //let res = await getDeviceCount()
  //let s3 = res+1

  var RandomNumber = Math.floor(Math.random() * 100) + 1;
  //    alert(RandomNumber)

  let pad = '0000';
  let s3 = pad.substring(0, pad.length - RandomNumber.length) + RandomNumber;

  return s1 + '-' + s3;
};

export const getLeadId1 = () => {
  let s1 = APLLICATION_RECORD.EVENT ? APLLICATION_RECORD.EVENT.shortCode : "XX";
  if (APLLICATION_RECORD.FORM){
      let short = APLLICATION_RECORD.FORM.shortCode;
      if (short && short.length){
          s1 += "-"+short;
      }
  }

  let s2 = getDeviceNum();
  var RandomNumber = Math.floor(Math.random() * 100) //+ 1;
  let s3 = (RandomNumber+1).toString();
  
  let pad = "0000";
  s3 = pad.substring(0, pad.length - s3.length) + s3;
  return s1+"-"+s2+"-"+s3;
}

export const getDeviceCount1 = async () => {
  let user = APLLICATION_RECORD.CURRENT_USER;
  let form = APLLICATION_RECORD.FORM;

  if (form && form.randomKey){
      let counts = AsyncStorage.getItem("form-counts") || "{}";
      if (counts.hasOwnProperty(form.randomKey)){
          return parseInt(counts[form.randomKey]);
      } else {
          return 0;
      }
  }
  else if (user && user.randomKey){
      let counts = AsyncStorage.getItem("device-counts") || "{}";
      if (counts.hasOwnProperty(user.randomKey)){
          return parseInt(counts[user.randomKey]);
      } else {
          return 0;
      }
  }

  return parseInt(AsyncStorage.getItem("device-count") || "0");
}

export const getDeviceNum = () => {
  let user = APLLICATION_RECORD.CURRENT_USER;
  if (user && user?.deviceNum){
      return user.deviceNum;
  }
  // let val =  AsyncStorage.getItem("device-num")
  return AsyncStorage.getItem("device-num") || "01";
}

export const incrementDeviceCount = () => {
  let user = APLLICATION_RECORD.CURRENT_USER;
        let form = APLLICATION_RECORD.FORM;

        if (form && form.randomKey){
            let counts = AsyncStorage.getItem("form-counts") || "{}";
            counts[form.randomKey] = getDeviceCount1()+1;
            let value = JSON.stringify(counts)
           if (value) {
               AsyncStorage.setItem("form-counts", counts);
             }
           // AsyncStorage.setItem("form-counts", counts);
        }
        else if (user && user.randomKey){
            let counts = AsyncStorage.getItem("device-counts") || "{}";
            counts[user.randomKey] = getDeviceCount1()+1;
            AsyncStorage.setItem("device-counts", counts);
        } else {
           AsyncStorage.setItem("device-count", (getDeviceCount1()+1).toString());
        }
}


export const getDeviceCount = async () => {
  let user = APLLICATION_RECORD.CURRENT_USER;
  let form = APLLICATION_RECORD.FORM;

  if (form && form.randomKey) {
    // let counts = getToken("form-counts") || "{}";
    const value = await AsyncStorage.getItem('form-counts');
    if (value !== null) {
      if (value.hasOwnProperty(form.randomKey)) {
        return parseInt(value[form.randomKey]);
      } else {
        return parseInt(value[form.randomKey]);
      }
    } else {
      let newCount = {};
      //console.log(form.randomKey);
      return form.randomKey;
    }
  } else if (user && user.randomKey) {
    let counts = await AsyncStorage.getItem('device-counts');
    if (counts !== null) {
      if (counts.hasOwnProperty(user.randomKey)) {
        return parseInt(counts[user.randomKey]);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  return parseInt('0');
};

export const valueIsFile = (value) => {

  let fileRoot = RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath || '';
  console.log('File system root: %s', fileRoot);

  if (typeof value !== "string"){
      return false;
  }

  if (value.indexOf('file://') === 0){
      return true;
  }

  if (value.indexOf('http://localhost:8080') === 0){
      return true;
  }

  if (fileRoot.length){
      if (value.indexOf(fileRoot) === 0){
          return true;
      }
  }

  return false;
}
