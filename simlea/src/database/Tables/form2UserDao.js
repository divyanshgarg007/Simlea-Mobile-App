import SQLite from "react-native-sqlite-storage";
import { DATABASE } from "../Constants";

const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });


const initialState = {
    tableName: "form2user",
    tableColumns: {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "event_id": "INTEGER",
        "form_id": "INTEGER",
        "user_id": "INTEGER"
    },
    foreignKeys: [
        "FOREIGN KEY(`event_id`) REFERENCES `event`(`id`)",
        "FOREIGN KEY(`form_id`) REFERENCES `form`(`id`)",
        "FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)"
    ]
}



export const setFormsForUser = (eventId, userId, formIds, wipe = true) => {
    // get existing user ids
    //console.log("setFormsForUser", eventId, userId, formIds);
    let sql = 'SELECT * FROM form2user WHERE event_id = ? AND user_id = ?';

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [eventId, userId], (trans, result) => {
                let toAdd = formIds;
                let toRemove = [];
                for (let i = 0; i < result.rows.length; ++i) {
                    let curFormId = result.rows.item(i).form_id;
                    let c = toAdd.indexOf(curFormId);

                    if (c !== -1) {
                        // already exists, no need to add
                        toAdd.splice(c, 1);
                    } else {
                        // in DB, but not to be added
                        toRemove.push(curFormId);
                    }
                }

                const promises = [];

                if (wipe && toRemove.length) {
                    const placeHolders = new Array(toRemove.length).fill("?").join(",");
                    toRemove.push(eventId);
                    toRemove.push(userId);
                    sql = 'DELETE FROM form2user WHERE form_id IN (' + placeHolders + ') AND event_id = ? AND user_id = ?';
                    // console.log("Remove from forms", sql);
                    let p = db.executeSql(sql, toRemove);
                    promises.push(p);
                }
                if (toAdd.length) {
                    let stack = [];
                    let insert = "INSERT INTO `form2user` (event_id,user_id,form_id) VALUES (?,?,?)";
                    for (let i = 0; i < toAdd.length; ++i) {
                        let params = [eventId, userId, toAdd[i]];
                        stack.push([insert, params]);
                    }
                    //  console.log("Add to forms", stack);
                    let p = db.sqlBatch(stack);
                    promises.push(p);
                }

                return resolve(promises);


            }, error => {
                // console.log("Set forms for user error", error);
                return resolve(error); ;
            });
        });
    });
}


export const FORM2USER_TABLE_NAME = initialState.tableName;
export const FORM2USER_TABLE_CALUMNS = initialState.tableColumns;
export const FORM2USER_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;