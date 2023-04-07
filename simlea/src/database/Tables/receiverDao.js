import SQLite from "react-native-sqlite-storage";
import { DATABASE } from "../Constants";

const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });

export const initTable = async (remoteFormId, data) => {
    if (!data || !data.length) {
        return Promise.resolve("no data to create table");
    }

    let tableName = "receiver_" + parseInt(remoteFormId);

    // drop existing table
    const stack = ["DROP TABLE IF EXISTS `" + tableName + "`"];

    // create table & columns
    const record = data[0];
    const arr = ["`id` INTEGER PRIMARY KEY"];
    for (let i in record) {
        arr.push("`" + i + "` TEXT"); // store all as text
    }
    stack.push("CREATE TABLE `" + tableName + "` (" + arr.join(", ") + ")");

    // insert data
    const len = arr.length; // +1 for id column
    const placeHolders = new Array(len).fill("?").join(",");
    const insert = "INSERT INTO `" + tableName + "` VALUES (" + placeHolders + ")";

    for (let i = 0; i < data.length; ++i) {
        let id = i + 1;
        let row = [id];
        for (let column in data[i]) {
            //console.log(data[i][column])
            row.push(data[i][column]);
        }
        stack.push([insert, row]);
    }

    //console.log(stack);

    let batchResult = await db.sqlBatch(stack);
    return Promise.resolve(batchResult);
}



export const getData = (remoteFormId, query = "", limits = null) => {
    let tableName = "receiver_" + remoteFormId;
    //console.log("Query table %s with %s", tableName, query);

    if (query) {
        // get columns
        let sql = "PRAGMA table_info('" + tableName + "')";


        return new Promise((resolve, reject) => {
            return db.transaction((trans) => {
                return trans.executeSql(sql, [], (trans, tableInfo) => {
                    //console.log("Got columns of table %s", tableName);
                    //console.log(tableInfo);
                    const columns = [];
                    const tmp = [];
                    for (let i = 0; i < tableInfo.rows.length; i++) {
                        let row = tableInfo.rows.item(i);
                        columns.push(row.name);
                        tmp.push("`" + row.name + "` LIKE ?");
                    }
                    let sql = "SELECT * FROM `" + tableName + "` WHERE " + tmp.join(" OR ");
                    if (limits) {
                        sql += " LIMIT " + limits.limit + " OFFSET " + limits.offset;
                    }
                    const params = new Array(tmp.length).fill("%" + query + "%");

                    return trans.executeSql(sql, params, (trans, data) => {
                        let rows = [];
                        for (let i = 0; i < data.rows.length; i++) {
                            rows.push(data.rows.item(i));
                        }
                        //console.log("Superselect result", rows);
                        return resolve(rows);
                    });
                });
            });
        });
    } else {
        // get all
        let sql = "SELECT * FROM `" + tableName + "`";
        if (limits) {
            sql += " LIMIT " + limits.limit + " OFFSET " + limits.offset;
        }

        return new Promise((resolve, reject) => {
            return db.transaction((trans) => {
                return trans.executeSql(sql, [], (trans, data) => {
                    let rows = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        rows.push(data.rows.item(i));
                    }
                    //console.log("Superselect result", rows);
                    return resolve(rows);
                });
            });
        });
    }
}