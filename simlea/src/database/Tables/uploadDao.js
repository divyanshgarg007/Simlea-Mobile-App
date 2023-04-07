import RNFS from 'react-native-fs';
import SQLite from "react-native-sqlite-storage";
import { APLLICATION_RECORD, DATABASE } from '../Constants';
import * as utility from '../../database/UtilityService';

const initialState = {
    tableName: "upload",
    tableColumns: {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "event_id": "INTEGER",
        "form_id": "INTEGER",
        "remote_form_id": "INTEGER",
        "record_id": "INTEGER", // local id
        "remote_record_id": "INTEGER",
        "record_guid": "TEXT",
        "field": "TEXT",
        "coll_idx": "INTEGER",
        "uploaded": "INTEGER NOT NULL DEFAULT 0",
        "filename": "TEXT",
        "path": "TEXT", // relative path
        "fullpath": "TEXT"
    },
    foreignKeys: [
        "FOREIGN KEY(`event_id`) REFERENCES `event`(`id`)",
        "FOREIGN KEY(`form_id`) REFERENCES `form`(`id`)"
    ]
}


const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });


/**
  * Execute sql queries
  * 
  * @returns {resolve} results
  */
export const getFilesForUpload = (eventId, formIds, recordId = null) => {
    if (!formIds.length) {
        return Promise.resolve([]);
    }

    let params = [eventId].concat(formIds);
    const placeHolders = new Array(formIds.length).fill("?").join(",");

    let sql = "SELECT * FROM `" + UPLOAD_TABLE_NAME + "` WHERE uploaded = 0 AND event_id = ? AND form_id IN (" + placeHolders + ")";
    if (recordId) {
        sql += " AND record_id = ?";
        params.push(recordId);
    }

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, params, (trans, results) => {

                 trans.executeSql("SELECT * FROM `" + UPLOAD_TABLE_NAME + "`", [], (trans, results1) => {
                    for (let i = 0; i < results1.rows.length; ++i) {
                        console.log(results1.rows.item(i));
                    }
                })
                let promises = [];
                let uploads = [];
                const rootDir = RNFS.DocumentDirectoryPath;
                const processRow = (row) => {
                    let p = rootDir + row.path
                    uploads.push(row)
                    promises.push(p);
                };
                for (let i = 0; i < results.rows.length; ++i) {
                    processRow(results.rows.item(i));
                }

                return Promise.all(promises).then(() => {
                    return resolve(uploads);
                });

            })
        })
    })
}

/**
  * Execute sql queries
  * 
  * @returns {resolve} results
  */
export const save = (model) => {
    // check if already exists
    if (!model.id) {
        return getIdByFilename(model.filename).then(id => {
            if (id) {
                //console.log('Upload entry for file %s already exists', model.filename);
                return null;
            }
            return saveFile(model);
        });
    } else {
        return saveFile(model);
    }
}

export const getIdByFilename = (filename) => {
    let sql = "SELECT id FROM `" + UPLOAD_TABLE_NAME + "` WHERE filename = ?";

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [filename], (trans, result) => {
                if (result.rows.length) {
                    return resolve(result.rows.item(0).id);
                }
                return resolve(0);


            })
        })
    })
}

export const saveFile = async (model) => {
    let sql = "SELECT * FROM `" + UPLOAD_TABLE_NAME + "` WHERE id = ?";
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [model.id], async (trans, results) => {
                if (results.rows.length === 0 && results) {
                    let saveResUpdate = await insertRow(model, model.id)
                    //console.log('saveResUpdate %s', UPLOAD_TABLE_NAME,saveResUpdate)
                    resolve(true)
                }
                else {
                    let insertResUpdate = await updateRow(model, model.id)
                    //console.log('insertResUpdate%s', UPLOAD_TABLE_NAME, insertResUpdate)
                    resolve(true)
                }
            },
                (error) => {
                    //console.log('error',error)
                    resolve(error)
                });
        });
    });
};


export const insertRow = (row) => {
    let fields = [];
    let params = [];
    let placeholders = [];
    // delete row["id"];
    for (let column in row) {
        if (row.hasOwnProperty(column)) {

            fields.push("`" + column + "`");
            params.push(row[column]);
            placeholders.push("?");
        }
    }

    let sql = "INSERT INTO `" + UPLOAD_TABLE_NAME + "` (" + fields.join(",") + ") VALUES (" + placeholders.join(",") + ")";
    //console.log("addObject", sql, params);

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, params, (trans, results) => {


                // trans.executeSql("SELECT * FROM `"+USER_TABLE_NAME+"`", [], async (trans, results1) => {
                //     //console.log(results1, results1.rows.item(0))
                // })
                row.id = results.insertId;
                return resolve(row.id)

            },
                (error) => {
                    //console.log('error',error)
                    reject(error)
                });
        });
    });
}

export const updateRow = (row, id) => {
    let fields = [];
    let params = [];

    delete row["id"];

    for (let column in row) {

        if (row.hasOwnProperty(column)) {

            fields.push("`" + column + "` = ?");
            params.push(row[column]);
        }
    }

    if (!fields.length) {
        //console.log("updateRow(): no data to update");
        return Promise.resolve(null);
    }

    params.push(id);

    let sql = "UPDATE `" + UPLOAD_TABLE_NAME + "` SET " + fields.join(",") + " WHERE id = ?";
    //console.log(["updateObject %s", UPLOAD_TABLE_NAME,sql, params]);


    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, params, (trans, results) => {

                 trans.executeSql("SELECT * FROM `" + UPLOAD_TABLE_NAME + "`", [], (trans1, results1) => {
                    for (let i = 0; i < results1.rows.length; ++i) {
                        console.log(results1.rows.item(i));
                    }
                })

                return resolve(row.id)
            },
                (error) => {
                    //console.log('error',error)
                    reject(error)
                });
        });
    });
}

export const addFilesFromRecord = (form, recordId, collIndex, data = {}) => {
    //console.log('addFilesFromRecord()', data);

    // alert('CURRETNEVENT', APLLICATION_RECORD.EVENT)
    let event = APLLICATION_RECORD.EVENT;
    let recordTable = 'form_data_' + form.id;
    let sql = 'SELECT remote_id,guid FROM `' + recordTable + '` WHERE id = ?';


    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [recordId], (trans, results) => {
                let guid = '';
                let remoteId = 0;
                if (results.rows.length) {
                    let row = results.rows.item(0);
                    guid = row.guid;
                    remoteId = row.remote_id;
                }
//21321@@####@@##@##@
                let promises = [];
                for (let field in data){
                    if (data.hasOwnProperty(field)){
                        if (utility.valueIsFile(data[field])){
                            let bind = {
                                event_id: event.eventId, // latest ui login changes than code change
                                form_id: form.id,
                                remote_form_id: form.remoteId,
                                record_id: recordId,
                                record_guid: guid,
                                remote_record_id: remoteId,
                                coll_idx: collIndex,
                                field: field,
                                uploaded: 0,
                                filename: filenameFromPath(data[field]),
                                path: getRelativePath(data[field]),
                                fullpath: data[field]
                            };

                            let upload = bind;
                            promises.push(save(upload));
                        }
                    }
                }

                return resolve(promises)

            });
        });
    });


    // return this.db.executeSql(sql, [recordId]).then(results => {



    //     return Promise.all(promises);
    // });
}


export const filenameFromPath = (path) => {
    let slashPos = path.lastIndexOf('/');
    if (slashPos !== -1){
        return path.substring(slashPos + 1);
    }
    return path;
}

export const getRelativePath = (fullpath) => {
    let rootPath = RNFS.DocumentDirectoryPath || RNFS.ExternalStorageDirectoryPath || '';

    if (fullpath.indexOf(rootPath) === 0){
        return fullpath.substring(rootPath.length);
    }

    let normPath = rootPath;
    if (fullpath.indexOf(normPath) === 0){
        return fullpath.substring(normPath.length);
    }

    console.log("Could not find relative path", fullpath, rootPath, normPath);

    return fullpath;
}




export const UPLOAD_TABLE_NAME = initialState.tableName;
export const UPLOAD_TABLE_CALUMNS = initialState.tableColumns;
export const UPLOAD_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;