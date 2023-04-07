import {APLLICATION_RECORD, DATABASE} from '../Constants';
import {USER_TABLE_NAME} from './userDao';
import * as record2UserDao from '../Tables/record2UserDao';
import * as Utility from '../UtilityService';
import SQLite from 'react-native-sqlite-storage';

const initialState = {
  tableName: 'form',
  tableColumns: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    remote_id: 'INTEGER', // id on server
    event_id: 'INTEGER', // associated event
    deleted: 'INTEGER NOT NULL DEFAULT 0',
    name: 'TEXT',
    short_code: 'TEXT',
    version: 'INTEGER',
    production: 'INTEGER NOT NULL DEFAULT 0',
    description: 'TEXT',
    default_language: 'TEXT',
    fallback_language: 'TEXT',
    languages: 'TEXT', // json string of languages
    //"abbyy_languages": "TEXT",
    view_columns: 'TEXT',
    search_columns: 'TEXT',
    elements: 'TEXT', // json string of structure
    random_key: 'TEXT', //,
    remoteId: 'INTEGER', // id on server
    shortCode: 'TEXT',
    defaultLanguage: 'TEXT',
    fallbackLanguage: 'TEXT',
    viewColumns: 'TEXT',
    searchColumns: 'TEXT',
    randomKey: 'TEXT', //
    eventId: 'INTEGER', // associated event
    //"validation": "TEXT" // json string of validation config
  },
  foreignKeys: ['FOREIGN KEY(`event_id`) REFERENCES `event`(`id`)'],
  collectionTables: {},
};

const db = SQLite.openDatabase(
  {name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1},
  () => {},
);

export const getDataColumns = () => {
  return {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    remote_id: 'INTEGER', // id on server
    form_id: 'INTEGER', // associated form
    event_id: 'INTEGER', // local event id
    user_id: 'INTEGER', // local user
    lead_id: 'TEXT', // unique lead id, like "01-E1-0001"
    lead_lang: 'TEXT', // selected language
    timestamp: 'INTEGER',
    server_timestamp: 'INTEGER', // last change on server
    sync_on: 'INTEGER NOT NULL DEFAULT 0', // timestamp of sync
    modified: 'INTEGER NOT NULL DEFAULT 0',
    deleted: 'INTEGER NOT NULL DEFAULT 0',
    deleted_by: 'TEXT',
    guid: 'TEXT',
    contact_checked: 'INTEGER NOT NULL DEFAULT 0',
    selected_user_id: 'INTEGER',
    draft: 'INTEGER NOT NULL DEFAULT 0',
    waitlist_user_id: 'INTEGER',
  };
};

/**
 * Execute sql queries
 * @param eventId
 *
 * @returns {resolve} results
 */
export const getList = eventId => {
  let sql =
    'SELECT f.* , f.rowid AS rowid FROM `' +
    FORM_TABLE_NAME +
    '` f INNER JOIN form2user f2u ON f2u.form_id = f.id AND f2u.user_id = ? AND f2u.event_id = ? ORDER BY `name` DESC';
  let userId = APLLICATION_RECORD.APP_USER_ID;

  // console.log(sql, userId, eventId);
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [userId, eventId],
        (trans, results) => {
          //   trans.executeSql("SELECT * FROM `"+FORM_TABLE_NAME+"`", [], (trans, results1) => {

          //      for (let i=0; i<results1.rows.length; ++i){
          //       console.log('FORM_TABLE_NAME',results1.rows.item(i))
          //   }
          // })
          //   trans.executeSql("SELECT * FROM form2user", [], (trans, results2) => {
          //     for (let i=0; i<results2.rows.length; ++i){
          //       console.log('form2user',results2.rows.item(i))
          //   }
          // })

          let forms = [];
          for (let i = 0; i < results.rows.length; ++i) {
            forms.push(results.rows.item(i));
          }
          //  console.log("Got forms", forms);
          resolve(forms);
        },
        error => {
          //  console.error('error', error);
          resolve([]);
        },
      );
    });
  });
};

export const setRemoteRecordIds = async (map, syncDate = null) => {
  //alert(JSON.stringify(map))

  if (map == null) {
    return Promise.resolve([]);
  }

  console.log(map);
  let stack = [];
  for (let key in map) {
    let parts = key.split('_');
    if (parts.length != 2) {
      //console.log('Bad key: ' + key);
      continue;
    }
    let syncTs = syncDate ? syncDate * 1000 : new Date().getTime();
    let formId = parts[0];
    let recordId = parts[1];
    let remoteId = map[key];
    let sql =
      'UPDATE form_data_' +
      formId +
      ' SET modified = 0, sync_on = ?, remote_id = ? WHERE form_id = ? AND id = ?';
    let params = [syncTs, remoteId, formId, recordId];
    stack.push([sql, params]);
  }

  // console.log('setRemoteRecordIds()', stack);

  if (stack.length === 0) {
    return [];
  }
  let dat6a = await db.sqlBatch(stack);

  return dat6a;
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.sqlBatch(stack, [], (trans, results) => {
        alert('');
        return resolve(results);
      });
    });
  });
};

// getList(eventId: number){
//     console.log("Getting form list, event id "+eventId);
//     let userId = MyApp.currentUser.id;
//     //let sql = "SELECT * FROM `"+this.tableName+"` WHERE event_id = ? AND deleted = 0 ORDER BY `name` DESC";
//     let sql = "SELECT f.* FROM `"+this.tableName+"` f INNER JOIN form2user f2u ON f2u.form_id = f.id AND f2u.user_id = ? AND f2u.event_id = ? ORDER BY `name` DESC";
//     return this.db.executeSql(sql, [userId, eventId]).then(result => {
//         let forms = [];
//         for (let i=0; i<result.rows.length; ++i){
//             forms.push(new Form(result.rows.item(i)));
//         }
//         console.log("Got forms", forms);
//         return forms;
//     }, error => {
//         console.log("formDao.getList() error", error);
//         return [];
//     });
// }

// getList(eventId: number){
//     console.log("Getting form list, event id "+eventId);
//     let userId = MyApp.currentUser.id;
//     //let sql = "SELECT * FROM `"+this.tableName+"` WHERE event_id = ? AND deleted = 0 ORDER BY `name` DESC";
//     let sql = "SELECT f.* FROM `"+this.tableName+"` f INNER JOIN form2user f2u ON f2u.form_id = f.id AND f2u.user_id = ? AND f2u.event_id = ? ORDER BY `name` DESC";
//     return this.db.executeSql(sql, [userId, eventId]).then(result => {
//         let forms = [];
//         for (let i=0; i<result.rows.length; ++i){
//             forms.push(new Form(result.rows.item(i)));
//         }
//         console.log("Got forms", forms);
//         return forms;
//     }, error => {
//         console.log("formDao.getList() error", error);
//         return [];
//     });
// }

export const getLocalFormIds = eventId => {
  let sql =
    'SELECT id, remoteId FROM `' + FORM_TABLE_NAME + '` WHERE eventId = ?';
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [eventId],
        (trans, result) => {
          let map = {};
          for (let i = 0; i < result.rows.length; ++i) {
            let row = result.rows.item(i);
            map[row.remoteId] = row.id;
          }

          resolve(map);
        },
        error => {
          console.log('error', error);
          resolve(error);
        },
      );
    });
  });
};

export const getFormByRemoteId = remoteId => {
  let sql = 'SELECT * FROM `' + FORM_TABLE_NAME + '` WHERE remoteId = ?';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [remoteId],
        (trans, result) => {
          //  alert('Form Result',JSON.stringify(result))
          if (result.rows.length) {
            return resolve(result.rows.item(0));
          }
          return resolve(null);
        },
        error => {
          // console.log('error', error);
          resolve(error);
        },
      );
    });
  });
};

export const saveFile = async model => {
  let sql = 'SELECT * FROM `' + FORM_TABLE_NAME + '` WHERE id = ?';
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [model.id],
        async (trans, results) => {
          if (results.rows.length === 0 && results) {
            let saveResUpdate = await insertRow(model, model.id);
            // console.log('saveResUpdate %s', FORM_TABLE_NAME, saveResUpdate);
            resolve(true);
          } else {
            let insertResUpdate = await updateRow(model, model.id);
            // console.log('insertResUpdate%s', FORM_TABLE_NAME, insertResUpdate);
            resolve(true);
          }
        },
        error => {
          // console.log('error', error);
          resolve(error);
        },
      );
    });
  });
};

export const insertRow = (row, table = null) => {
  let fields = [];
  let params = [];
  let placeholders = [];
  // delete row["id"];
  for (let column in row) {
    if (row.hasOwnProperty(column)) {
      fields.push('`' + column + '`');
      params.push(row[column]);
      placeholders.push('?');
    }
  }

  if (!table) {
    table = FORM_TABLE_NAME;
  }

  let sql =
    'INSERT INTO `' +
    table +
    '` (' +
    fields.join(',') +
    ') VALUES (' +
    placeholders.join(',') +
    ')';
  // console.log('addObject', sql, params);

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, results) => {
          // trans.executeSql("SELECT * FROM `"+USER_TABLE_NAME+"`", [], async (trans, results1) => {
          //     console.log(results1, results1.rows.item(0))
          // })
          // row.id = results.insertId; // latest changes when save fun not woek
          row['id'] = results.insertId;
          return resolve(row.id);
        },
        error => {
          console.error('error', error);
          reject(error);
        },
      );
    });
  });
};

export const updateRow = (row, id, table = null) => {
  let fields = [];
  let params = [];

  if (row['id'] != undefined && row['id'] != null) {
    delete row['id'];
  }

  for (let column in row) {
    if (row.hasOwnProperty(column)) {
      fields.push('`' + column + '` = ?');

      //   console.log(row[column]);
      if (typeof row[column] === 'object' && row[column] != undefined) {
        let newVal = row[column].toString();
        // alert(newVal)
        params.push(newVal);
      } else {
        params.push(row[column]);
      }
    }
  }

  if (!fields.length) {
    // console.log('updateRow(): no data to update');
    return Promise.resolve(null);
  }
  params.push(id);

  if (!table) {
    table = FORM_TABLE_NAME;
  }

  let sql = 'UPDATE `' + table + '` SET ' + fields.join(',') + ' WHERE id = ?';
  //  console.log(['updateObject %s', table, sql, params]);

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, results) => {
          // console.log(results);
          return resolve(row.id);
        },
        error => {
          // console.log('error', error);
          reject(error);
        },
      );
    });
  });
};

export const removeUserFromAll = localEventId => {
  //console.log('removeUserFromAll()', localEventId);
  const map = getLocalFormIds(localEventId);
  const formIds = [];
  for (let i in map) {
    if (map.hasOwnProperty(i)) {
      formIds.push(map[i]);
    }
  }
  return record2UserDao.removeUserFromAll(
    formIds,
    APLLICATION_RECORD.CURRENT_USER.id,
  );
};

/**
 * Handle remote record
 *
 * @param {object} record
 * @returns {Promise<{formId, recordId}>} local record & form id
 */
export const insertOrUpdateRecord = record => {
  // console.log('insertOrUpdateRecord()', record);
  let remoteFormId = record.form_id;
  let remoteRecordId = record.record_id;
  let guid = record.guid;
  let deleted = 0;
  if (record.hasOwnProperty('deleted')) {
    deleted = record.deleted;
  }
  //let timestamp = record.modified_on * 1000;
  let formData = record.data;

  if (record.guid) {
    formData['guid'] = record.guid;
  }
  if (record.lead_id) {
    formData['lead_id'] = record.lead_id;
  }
  if (record.lead_lang) {
    formData['lead_lang'] = record.lead_lang;
  }
  if (record.created_on) {
    formData['timestamp'] = record.created_on * 1000;
  }
  if (record.server_timestamp) {
    formData['server_timestamp'] = record.server_timestamp;
  }
  if (record.sync_on) {
    formData['sync_on'] = record.sync_on * 1000;
  }
  if (record.selected_user_id) {
    formData['selected_user_id'] = record.selected_user_id;
  }

  // get local form id
  let sql = 'SELECT id FROM `' + FORM_TABLE_NAME + '` WHERE remoteId = ?';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [remoteFormId],
        async (trans, result) => {
          if (result.rows.length) {
            let formId = result.rows.item(0).id;

            let recordId = await getLocalRecordId(formId, remoteRecordId, guid);
            let created = await checkDataTable(formId, formData);

            if (recordId) {
              // record exists
              formData['modified'] = 0;
              formData['deleted'] = deleted;
              return updateRowDymanicFormID(
                formData,
                recordId,
                'form_data_' + formId,
              ).then(() => {
                return record2UserDao
                  .addUserToRecord(
                    formId,
                    APLLICATION_RECORD.APP_USER_ID,
                    recordId,
                  )
                  .then(() => {
                    return resolve({
                      recordId: recordId,
                      formId: formId,
                    });
                  });
              });
            } else {
              // new record
              formData['remote_id'] = remoteRecordId;
              formData['form_id'] = formId;
              formData['event_id'] = APLLICATION_RECORD.APP_EVENT_ID;
              formData['modified'] = 0;
              formData['deleted'] = deleted;
              return insertRowDymanicFormID(
                formData,
                'form_data_' + formId,
              ).then(result => {
                return record2UserDao
                  .addUserToRecord(
                    formId,
                    APLLICATION_RECORD.APP_USER_ID,
                    result.insertId,
                  )
                  .then(() => {
                    return resolve({
                      recordId: result.insertId,
                      formId: formId,
                    });
                  });
              });
            }
          } else {
            //            console.log('Form with remote id %s not found', remoteFormId);
          }
        },
        error => {
          resolve(error);
        },
      );
    });
  });
};

export const updateRowDymanicFormID = (row, id, table = null) => {
  let fields = [];
  let params = [];

  delete row['id'];

  if (!table) {
    table = this.tableName;
  }

  for (let column in row) {
    if (row.hasOwnProperty(column)) {
      fields.push('`' + column + '` = ?');
      params.push(row[column]);
    }
  }

  if (!fields.length) {
    return Promise.resolve(null);
  }

  params.push(id);

  let sql = 'UPDATE `' + table + '` SET ' + fields.join(',') + ' WHERE id = ?';
  // return db.executeSql(sql, params);
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, params, (trans, result) => {
        return resolve(true);
      });
    });
  });
};

export const insertRowDymanicFormID = (row, table = null) => {
  let fields = [];
  let params = [];
  let placeholders = [];

  if (!table) {
    table = this.tableName;
  }

  for (let column in row) {
    if (row.hasOwnProperty(column)) {
      fields.push('`' + column + '`');
      params.push(row[column]);
      placeholders.push('?');
    }
  }

  let sql =
    'INSERT INTO `' +
    table +
    '` (' +
    fields.join(',') +
    ') VALUES (' +
    placeholders.join(',') +
    ')';
  // return db.executeSql(sql, params);
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, params, (trans, result) => {
        return resolve(true);
      });
    });
  });
};

export const checkDataTable = (formId, formData) => {
  let sql = "PRAGMA table_info('form_data_" + formId + "')";

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [],
        (trans, result) => {
          if (result.rows.length == 0) {
            // does not exist
            return resolve(createDataTable(formId, formData));
          } else {
            let columns = [];
            for (let i = 0; i < result.rows.length; ++i) {
              let row = result.rows.item(i);
              columns.push(row.name);
            }
            return resolve(updateDataTable(formId, columns, formData));
          }
        },
        error => {
          return resolve(createDataTable(formId, formData));
        },
      );
    });
  });
};

export const createDataTable = (formId, formData) => {
  const columns = getDataColumns();

  let foreignKeys = [
    'FOREIGN KEY(`form_id`) REFERENCES `form`(`id`)',
    'FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)',
  ];

  // set all form fields as text
  for (let i in formData) {
    if (formData.hasOwnProperty(i)) {
      if (columns.hasOwnProperty(i)) {
        // duplicate key ... very bad
      } else {
        columns[i] = 'TEXT';
      }
    }
  }

  const arr = [];
  for (let i in columns) {
    arr.push('`' + i + '` ' + columns[i]);
  }
  for (let i in foreignKeys) {
    arr.push(foreignKeys[i]);
  }
  const tableName = 'form_data_' + formId;
  const statement = 'CREATE TABLE `' + tableName + '` (' + arr.join(', ') + ')';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        statement,
        [],
        (trans, result) => {
          return resolve(true);
        },
        error => {
          return resolve(false);
        },
      );
    });
  });
};

export const updateDataTable = async (
  formId,
  existingColumns = [],
  formData,
) => {
  const tableName = 'form_data_' + formId;
  const promises = [];
  const dataColumns = getDataColumns();
  for (let column in formData) {
    if (!formData.hasOwnProperty(column)) {
      continue;
    }
    if (existingColumns.indexOf(column) == -1) {
      // does not exist
      let type = 'TEXT';
      if (dataColumns.hasOwnProperty(column)) {
        type = dataColumns[column];
      }
      let sql =
        'ALTER TABLE `' + tableName + '` ADD COLUMN `' + column + '` ' + type;

      return new Promise((resolve, reject) => {
        return db.transaction(trans => {
          return trans.executeSql(sql, [], (trans, result) => {
            promises.push(result);
          });
        });
      });
    }
  }
  await Promise.all(promises);
  return false;
};

export const getLocalRecordId = (formId, remoteRecordId, guid = null) => {
  const tableName = 'form_data_' + formId;
  let sql = 'SELECT id FROM `' + tableName + '` WHERE remote_id = ?';
  let params = [remoteRecordId];

  if (guid && guid.length) {
    sql += ' OR guid = ?';
    params.push(guid);
  }

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, result) => {
          let recordId = 0;
          if (result.rows.length) {
            recordId = result.rows.item(0).id;
          } else {
          }
          return resolve(recordId);
        },
        error => {
          //  console.error('error', error);
          return resolve(0);
        },
      );
    });
  });
};

export const getModifiedCounts = (eventId, formIds) => {
  let sql =
    "SELECT tbl_name FROM sqlite_master WHERE type='table' AND tbl_name LIKE 'form_data_%'";

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, [], (trans, result) => {
        let tmp = [];
        for (let i = 0; i < result.rows.length; ++i) {
          let row = result.rows.item(i);
          let tableName = row.tbl_name;
          let formId = parseInt(tableName.substring('form_data_'.length));
          if (formIds.indexOf(formId) != -1) {
            let sql =
              'SELECT ' +
              formId +
              ' AS form_id,COUNT(*) AS count FROM form_data_' +
              formId +
              ' WHERE modified = 1 AND event_id = ' +
              eventId;
            tmp.push(sql);
          }
        }

        if (!tmp.length) {
          return {total: 0};
        }

        let sql1 = tmp.join(' UNION ALL ');
        return trans.executeSql(sql1, [], (trans, result1) => {
          let counts = {};
          let total = 0;
          for (let i = 0; i < result1.rows.length; ++i) {
            let row = result1.rows.item(i);
            counts[row.form_id] = row.count;
            total += row.count;
          }
          counts['total'] = total;
          return resolve(counts);
        });
      });
    });
  });
};

export const getModifiedCountsForDraft = (eventId, formIds = [], draft = 0) => {

  let sql = "SELECT tbl_name FROM sqlite_master WHERE type='table' AND tbl_name LIKE 'form_data_%'";

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, [], (trans, result) => {
  // return this.db.executeSql(sql, []).then(result => {
      let tmp = [];
      for (let i = 0; i < result.rows.length; ++i){
          let row = result.rows.item(i);
          let tableName = row.tbl_name;
          let formId = parseInt(tableName.substring("form_data_".length));
          if (formIds.indexOf(formId) != -1){
              let sql = "SELECT "+formId+" AS form_id,COUNT(*) AS count FROM form_data_"+formId+" WHERE draft="+draft+" AND event_id = "+eventId;
              tmp.push(sql);
          }
      }

      if (!tmp.length){
          return {total: 0};
      }

      let sql = tmp.join(" UNION ALL ");
      return trans.executeSql(sql,[], (trans, result1) => {
          let counts = {};
          let total = 0;
          for (let i = 0; i < result1.rows.length; ++i){
              let row = result1.rows.item(i);
              counts[row.form_id] = row.count;
              total += row.count;
          }
          counts["total"] = total;
          return resolve(counts);
      })
      // .catch(reason => {
      //     console.log("getModifiedCounts() failed", reason);
      //     return {total: "err"};
      // });

  });
});
});

}

export const getCollectionData = (formId, fieldName, recordId = null) => {
  const tableName = 'collection_' + formId + '_' + fieldName;
  let sql = 'SELECT * FROM `' + tableName + '`';
  let params = [];
  if (recordId) {
    sql += ' WHERE record_id = ?';
    params.push(recordId);
  }
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, result) => {
          let records = [];
          for (let i = 0; i < result.rows.length; ++i) {
            records.push(result.rows.item(i));
          }
          return resolve(records);
        },
        error => {
          // probably the table does not exist yet
          // console.error('getCollectionData() failed', error);
          return reject([]);
        },
      );
    });
  });
};

export const deleteCollectionByRecordId = (formId, fieldName, recordId) => {
  const tableName = 'collection_' + formId + '_' + fieldName;

  let sql = 'DELETE FROM `' + tableName + '` WHERE `record_id` = ?';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      // trans.executeSql("SELECT * FROM `"+tableName+"`", [], (trans, result) => {
      //  console.log(result)
      // })

      return trans.executeSql(
        sql,
        [recordId],
        (trans, result) => {
          //console.log('deleteCollectionByRecordId() failed', result);
          return resolve(true);
        },
        error => {
          // probably the table does not exist yet
          //  console.error('deleteCollectionByRecordId() failed', error);
          return resolve(true);
        },
      );
    });
  });
};

export const saveCollectionData = (
  formId,
  fieldName,
  recordId,
  formData = [],
) => {
  let dummyRec = {};
  formData.forEach(record => {
    for (let i in record) {
      if (record.hasOwnProperty(i)) {
        dummyRec[i] = '';
      }
    }
  });

  return checkCollectionTable(formId, fieldName, dummyRec).then(created => {
    let promises = [];
    const tableName = 'collection_' + formId + '_' + fieldName;

    formData.forEach(data => {
      if (data['id']) {
        let p = updateRowDymanicFormID(data, data['id'], tableName);
        promises.push(p);
      } else {
        data['record_id'] = recordId;
        let p = insertRowDymanicFormID(data, tableName);
        promises.push(p);
      }
    });

    return Promise.all(promises);
  });
};

export const checkCollectionTable = (
  formId,
  fieldName,
  formData,
  retry = false,
) => {
  const tableName = 'collection_' + formId + '_' + fieldName;
  let sql = "PRAGMA table_info('" + tableName + "')";

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [],
        (trans, result) => {
          if (result.rows.length == 0) {
            // does not exist
            return resolve(
              createCollectionTable(formId, fieldName, formData).catch(
                reason => {
                  if (!retry && reason && reason.code == 5) {
                    return resolve(
                      checkCollectionTable(formId, fieldName, formData, true),
                    );
                  } else {
                    return Promise.reject(reason);
                  }
                },
              ),
            );
          } else {
            // check columns
            let columns = [];
            for (let i = 0; i < result.rows.length; ++i) {
              columns.push(result.rows.item(i).name.toLowerCase());
            }
            return resolve(updateCollectionTable(tableName, columns, formData));
          }
        },
        error => {
          // probably the table does not exist yet
          return resolve(
            createCollectionTable(formId, fieldName, formData).catch(reason => {
              // the table may have been just created
              // return false;
              return resolve(true);
            }),
          );
        },
      );
    });
  });
};

export const createCollectionTable = (formId, fieldName, collectionData) => {
  let columns = {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    record_id: 'INTEGER', // related local record id
  };

  let foreignKeys = [
    'FOREIGN KEY(`record_id`) REFERENCES `form_data_' + formId + '`(`id`)',
  ];

  // set all form fields as text
  for (let i in collectionData) {
    if (collectionData.hasOwnProperty(i)) {
      if (columns.hasOwnProperty(i)) {
        // duplicate key ... very bad
      } else {
        columns[i] = 'TEXT';
      }
    }
  }

  const arr = [];
  for (let i in columns) {
    arr.push('`' + i + '` ' + columns[i]);
  }
  for (let i in foreignKeys) {
    arr.push(foreignKeys[i]);
  }
  const tableName = 'collection_' + formId + '_' + fieldName;
  const statement = 'CREATE TABLE `' + tableName + '` (' + arr.join(', ') + ')';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(statement, [], (trans, result) => {
        return resolve(true);
      });
    });
  });
};

export const updateCollectionTable = async (
  tableName,
  existingColumns = [],
  formData,
) => {
  const promises = [];
  for (let column in formData) {
    if (!formData.hasOwnProperty(column)) {
      continue;
    }
    let lcColumn = column.toLowerCase();
    if (existingColumns.indexOf(lcColumn) == -1) {
      // does not exist
      let sql =
        'ALTER TABLE `' + tableName + '` ADD COLUMN `' + column + '` TEXT';
      promises.push(
        db.transaction(trans => {
          return trans.executeSql(
            statement,
            [],
            (trans, result) => {
              return true;
            },
            error => {
              // probably the table does not exist yet
            },
          );
        }),
      );
    }
  }
  await Promise.all(promises);
  return false;
};

export const getRecords = (
  formId,
  eventId,
  recordId = null,
  modifiedOnly = false,
) => {
  const tableName = 'form_data_' + formId;
  let params = [formId, eventId];
  let sql =
    'SELECT * FROM `' + tableName + '` d WHERE form_id = ? AND event_id = ?';

  if (recordId) {
    sql += ' AND id = ?';
    params.push(recordId);
  } else if (modifiedOnly) {
    sql += ' AND modified = 1';
  }

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, result) => {
          let records = [];

          for (let i = 0; i < result.rows.length; ++i) {
            records.push(result.rows.item(i));
          }
          // console.info('getRecords ', result.rows.length);
          return resolve(records);
        },
        error => {
          // console.error('getRecords failed', formId, reason, error);

          return resolve([]);
        },
      );
    });
  });
};

export const validateDataColumns = (formId, columns = []) => {
  const tableName = 'form_data_' + formId;
  let pragmas = ["PRAGMA table_info ('" + tableName + "')"];
  // get collection tables
  let sql =
    "SELECT tbl_name FROM sqlite_master WHERE type = 'table' AND tbl_name LIKE 'collection\\_" +
    formId +
    "\\_%' ESCAPE '\\'";

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, [], (trans, result) => {
        initialState.collectionTables[formId] = [];
        for (let i = 0; i < result.rows.length; ++i) {
          let row = result.rows.item(i);
          pragmas.push("PRAGMA table_info ('" + row.tbl_name + "')");
          initialState.collectionTables[formId].push(row.tbl_name);
        }
        let promises = [];
        isTrue = false;
        pragmas.forEach((sql, index) => {
          db.transaction(trans => {
            trans.executeSql(sql, [], (trans, result) => {
              //  console.log(result);
              promises.push(result);
              if (pragmas.length === index + 1) {
                isTrue = true;
                returnData();
              }
            });
          });
        });
        const returnData = () => {
          if (isTrue) {
            return Promise.all(promises).then(multiResult => {
              // console.log('get tableinfo result', multiResult);
              let existingColumns = [];
              let filteredColumns = [];
              for (let j = 0; j < multiResult.length; ++j) {
                let result = multiResult[j];
                for (let i = 0; i < result.rows.length; ++i) {
                  let row = result.rows.item(i);
                  existingColumns.push(row.name);
                }
              }

              // for (let i=0; i < columns.length; ++i){
              //   console.log("Column  ", existingColumns.indexOf(columns[i]),existingColumns, columns );
              //     if (existingColumns.indexOf(columns[i]) != -1){
              //         filteredColumns.push(columns[i]);
              //     } else {
              //        // console.log("Column does not exist: "+columns[i],promises);
              //     }
              // }
              for (let i = 0; i < existingColumns.length; ++i) {
                if (columns.includes(existingColumns[i])) {
                  if (existingColumns[i] === 'id') {
                    delete existingColumns[i];
                  } else {
                    filteredColumns.push(existingColumns[i]);
                  }
                }
              }
              return resolve(filteredColumns);
            });
          }
        };

        // if(promises.length > 0) {
        //   return Promise.all(promises).then(multiResult => {
        //     console.log("get tableinfo result",promises, multiResult);
        //     let existingColumns = [];
        //     let filteredColumns = [];
        //     for (let j=0; j < multiResult.length; ++j) {
        //         let result = multiResult[j];
        //         for (let i = 0; i < result.rows.length; ++i) {
        //             let row = result.rows.item(i);
        //             existingColumns.push(row.name);
        //         }
        //     }

        //     for (let i=0; i < columns.length; ++i){
        //         if (existingColumns.indexOf(columns[i]) != -1){
        //             filteredColumns.push(columns[i]);
        //         } else {
        //             console.log("Column does not exist: "+columns[i],promises);
        //         }
        //     }

        //     return resolve(filteredColumns);
        // });
        //  }
      });
    });
  });
};

export const getDataList = (
  formId,
  columns = [],
  order = null,
  search = null,
  filters = [],
  limits = null,
  draft = 0
) => {
  const tableName = 'form_data_' + formId;
  let eventId = APLLICATION_RECORD.APP_EVENT_ID; // MyApp.currentEvent.id;
  let wantedColumns = '*';
  let where = 'd.form_id = ? AND d.event_id = ? AND d.draft = ' + draft;
  let params = [formId, eventId];
  let joins = '';
  let group = '';

  order = order || {column: 'timestamp', dir: 'DESC'};

  if (columns && columns.length) {
    if (columns.indexOf('id') == -1) {
      columns = columns.concat(['id']);
    }
    columns.push('draft');
    wantedColumns = '`' + columns.join('`,`') + '`';
    wantedColumns = wantedColumns.replace('`id`', 'd.`id`');
    where += ' AND d.deleted = 0';
  }

  if (search) {
    let tmp = [];
    search.columns.forEach(column => {
      tmp.push('`' + column + '` LIKE ?');
      params.push('%' + search.query + '%');
    });
    where += ' AND (' + tmp.join(' OR ') + ')';
  }

  if (filters && filters.length) {
    // let filterConfig = this.buildFilterString(filters);
    // where += " AND " + filterConfig.where;
    // params = params.concat(filterConfig.params);
  }

  if ((columns && columns.length) || search || (filters && filters.length)) {
    let cts = initialState.collectionTables[formId];
    if (cts && cts.length) {
      let tmp = [];
      for (let i = 0; i < cts.length; ++i) {
        let short = 'c' + (i + 1);
        let join =
          'LEFT JOIN `' +
          cts[i] +
          '` ' +
          short +
          ' ON ' +
          short +
          '.`record_id` = d.`id`';
        tmp.push(join);
      }
      joins = ' ' + tmp.join(' ');
      group = ' GROUP BY d.`id`';
    }
  }

  // console.log("BackSync status", MyApp.currentUser.backSync);
  // if (MyApp.currentUser.backSync === false){
  //     joins += " INNER JOIN record2user r2u ON r2u.record_id = d.id AND r2u.form_id = " + formId + " AND r2u.user_id = " + MyApp.currentUser.id;
  // }

  let sql =
    'SELECT ' +
    wantedColumns +
    ' FROM `' +
    tableName +
    '` d ' +
    joins +
    ' WHERE ' +
    where +
    group +
    ' ORDER BY `' +
    order.column +
    '` ' +
    order.dir;

  if (limits) {
    sql += ' LIMIT ' + limits.limit + ' OFFSET ' + limits.offset;
  }

  //TODO: select label fields only, configurable order

  // return new Promise((resolve, reject) => {
  //   return  db.transaction((trans) => {
  //         trans.executeSql(sql, params, (trans, result) => {
  //         for (let i=0; i<result.rows.length; ++i){
  //           console.log(result.rows.item(i));
  //       }
  //     },
  //     (error) => {
  //       console.log("getDataList failed", error);
  //       return resolve([]);
  //     });
  //         trans.executeSql('SELECT * FROM form_data_1', [], (trans, result) => {
  //         for (let i=0; i<result.rows.length; ++i){
  //           console.log(result.rows.item(i));
  //       }
  //       })
  //     })
  //   })

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        params,
        (trans, result) => {
          // alert('sql table ')
          let records = [];
          for (let i = 0; i < result.rows.length; ++i) {
            records.push(result.rows.item(i));
          }
          console.log(records);
          return resolve(records);
        },
        error => {
          //   console.log('getDataList failed', formId, reason);
          return resolve([]);
        },
      );
    });
  });
};

export const getRecord = (formId, recordId) => {
  const tableName = 'form_data_' + formId;
  let sql = 'SELECT * FROM `' + tableName + '` WHERE id = ?';
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [recordId],
        (trans, result) => {
          return resolve(result.rows.length ? result.rows.item(0) : null);
        },
        error => {
          // console.error('getRecord() failed', formId, recordId, reason);
          return resolve(null);
        },
      );
    });
  });
};

export const saveFormData = (
  formId,
  eventId,
  recordId,
  formData,
  modified = true,
) => {
  return new Promise((resolve, reject) => {
    return checkDataTable(formId, formData).then(created => {
      // save data
      if (recordId != null) {
        formData['modified'] = modified ? 1 : 0;
        return updateRow(formData, recordId, 'form_data_' + formId).then(
          res => {
            return record2UserDao
              .addUserToRecord(formId, APLLICATION_RECORD.APP_USER_ID, recordId)
              .then(() => {
                // alert(JSON.stringify(res))
                return resolve(res);
              });
          },
        );
      } else {
        // alert('from add new one')
        // new record
        formData['remote_id'] = 0; // not on server yet
        formData['form_id'] = formId;
        formData['event_id'] = eventId;
        formData['user_id'] = APLLICATION_RECORD.APP_USER_ID;
        formData['lead_id'] = Utility.getLeadId1();
        formData['timestamp'] = new Date().getTime();
        formData['guid'] = Utility.generateGuid(); //Utility.generateGuid();
        formData['modified'] = modified ? 1 : 0;
        return insertRow(formData, 'form_data_' + formId).then(res => {
          //  Utility.incrementDeviceCount();
          return record2UserDao
            .addUserToRecord(
              formId,
              APLLICATION_RECORD.APP_USER_ID,
              res.insertId,
            )
            .then(() => {
              return resolve(res);
            });
        });
      }
    });
  });
};

export const markRecordsAsDeletedByGuid = (formId, guids = []) => {
  const tableName = 'form_data_' + formId;
  const placeHolders = new Array(guids.length).fill('?').join(',');

  let sql =
    'UPDATE `' +
    tableName +
    '` SET deleted = 1 WHERE guid IN (' +
    placeHolders +
    ')';

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        guids,
        (trans, result) => {
          console.log(result);
          resolve(true);
        },
        error => {
          console.log('error', error);
          resolve(error);
        },
      );
    });
  });

  //return this.db.executeSql(sql, guids);
};

export const getDataListDrafts = async () => {
  let records = []
  let forms = await getList(APLLICATION_RECORD.APP_EVENT_ID)
  return new Promise((resolve) => {
  forms.forEach(async (form, index) => {
          let formId = form.id;
          const tableName = "form_data_"+formId;
          let eventId = APLLICATION_RECORD.APP_EVENT_ID;
          let where = "d.form_id = ? AND d.event_id = ? AND d.draft = 1";
          let params = [formId, eventId];
          let joins = "";
          let group = "";

          let sql = "SELECT * FROM `"+tableName+"` d "+joins+" WHERE "+where+group+" order by timestamp desc";

         
          await db.transaction(async trans => {
            await trans.executeSql(  sql, params,  (trans, result) => {
                
                for (let i=0; i<result.rows.length; ++i){
                  records.push({...form,...result.rows.item(i)});
               }
                if(forms.length === (index + 1)) {
                   resolve(records);
              } 
            },
               error => {
                 console.log("getDataList failed", formId, reason);
                 if(error)
                  alert()
                  //  resolve(records);
              })
          });


          if(forms.length === (index + 1)) {
            resolve(records);
         } 
        

       });

     });
}

export const getListForDraft = eventId => {
  let sql =
    'SELECT f.* , f.rowid AS rowid FROM `' +
    FORM_TABLE_NAME +
    '` f INNER JOIN form2user f2u ON f2u.form_id = f.id AND f2u.user_id = ? AND f2u.event_id = ? ORDER BY `name` DESC';
  let userId = APLLICATION_RECORD.APP_USER_ID;
  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(
        sql,
        [userId, eventId],
        (trans, results) => {
          // })

          let forms = [];
          for (let i = 0; i < results.rows.length; ++i) {
            forms.push(results.rows.item(i));
          }
          // //  console.log("Got forms", forms);
          // resolve(forms);

        let records = [];
        forms.forEach(async form => {
        let formId = form.id;
        const tableName = "form_data_"+formId;
        let eventId = APLLICATION_RECORD.APP_EVENT_ID;
        let where = "d.form_id = ? AND d.event_id = ? AND d.draft = 1";
        let params = [formId, eventId];
        let joins = "";
        let group = "";

        let sql = "SELECT * FROM `"+tableName+"` d "+joins+" WHERE "+where+group+" order by timestamp desc";

         trans.executeSql(  sql, params,  (trans, result) => {
            for (let i=0; i<result.rows.length; ++i){
              records.push({...form,...result.rows.item(i)});
          }
          resolve(records);
          },error => {
            resolve(records);
         })
        });

        },
        error => {
          //  console.error('error', error);
          resolve([]);
        },
      );
    });
  });
};


export const getDataListDrafts1 = async () => {
  let records = []
  //  await getListForDraft(APLLICATION_RECORD.APP_EVENT_ID).then(async forms => {
    return new Promise(async (resolve, reject) => {
     let forms = await getListForDraft(APLLICATION_RECORD.APP_EVENT_ID) 
         return resolve(forms)
    })

      // for(let j = 0; j<forms.length; j++) {
      //     let form = forms[j];
      //     let formId = form.id;
      //     const tableName = "form_data_"+formId;
      //     let eventId = APLLICATION_RECORD.APP_EVENT_ID;
      //     let where = "d.form_id = ? AND d.event_id = ? AND d.draft = 1";
      //     let params = [formId, eventId];
      //     let joins = "";
      //     let group = "";
  
      //     let sql = "SELECT * FROM `"+tableName+"` d "+joins+" WHERE "+where+group+" order by timestamp desc";
  
      //      await db.transaction(async trans => {
      //      return trans.executeSql(  sql, params,  (trans, result) => {
      //         for (let i=0; i<result.rows.length; ++i){
      //           records.push({...form,...result.rows.item(i)});
      //       }
      //       if(forms.length === j){
      //         alert(JSON.stringify(records))
      //       }
      //       },error => {
      //         //  resolve(records);
      //         if(forms.length === j){
      //           alert(JSON.stringify(records))
      //         }
      //      })
      //     });


      // }
      
  // })
 // return records;
  
  
}



export const searchReplaceCollection = (formId, collName, recordId, column, search, replace) => {
  const tableName = "collection_" + formId + "_" + collName;
  const sql = "UPDATE `" + tableName + "` SET `" + column + "` = ? WHERE record_id = ? AND `" + column + "` = ?";
  const params = [replace, recordId, search];
  console.log(sql, params);

  return new Promise((resolve, reject) => {
    return db.transaction(trans => {
      return trans.executeSql(sql, params, (trans, results) => {
             resolve(true)
        })
      })
    })

}


export const FORM_TABLE_NAME = initialState.tableName;
export const FORM_TABLE_CALUMNS = initialState.tableColumns;
export const FORM_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;
