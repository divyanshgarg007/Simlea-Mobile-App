import SQLite from "react-native-sqlite-storage";
import { DATABASE } from "../Constants";

const initialState = {
    tableName: "record2user",
    tableColumns: {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "form_id": "INTEGER",
        "user_id": "INTEGER",
        "record_id": "INTEGER"
    },
    foreignKeys: [
        "FOREIGN KEY(`form_id`) REFERENCES `form`(`id`)",
        "FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)"
    ]
}

const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });


export const addUserToRecord = (formId, userId, recordId) => {
    // console.log("addUserToRecord", formId, userId, recordId);
    let sql = 'SELECT * FROM `' + RECORD2USER_TABLE_NAME + '` WHERE form_id = ? AND user_id = ? AND record_id = ?';

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [formId, userId, recordId], (trans, result) => {
                if (result.rows.length) {
                    return resolve(true); // already exists
                }
                let insert = "INSERT INTO `" + RECORD2USER_TABLE_NAME + "` (form_id,user_id,record_id) VALUES (?,?,?)";
                return trans.executeSql(insert, [formId, userId, recordId], (trans, result) => {
                    return resolve(true);
                })
            })
        })
    })
}

export const removeUserFromAll = (formIds, userId) => {
    // console.log("removeUserFromAll()", userId, formIds);
    const promises = [];
    formIds.forEach(formId => {
        let tableName = 'form_data_' + formId;
        let sql = "DELETE FROM record2user WHERE form_id = ? AND user_id = ? AND record_id IN (SELECT id FROM `" + tableName + "` WHERE remote_id > 0)";
        promises.push(db.transaction((trans) => { return trans.executeSql(sql, [formId, userId], (trans, results) => { return results }) }));
    });
    return Promise.all(promises);
}


export const RECORD2USER_TABLE_NAME = initialState.tableName;
export const RECORD2USER_TABLE_CALUMNS = initialState.tableColumns;
export const RECORD2USER_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;