import SQLite from "react-native-sqlite-storage";
import { DATABASE } from "../Constants";

const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });


export const initTable = (objectId, data, dropTable = true) => {
    let tableName = "superselect_" + parseInt(objectId);

    //  console.log("SuperSelect initTable " + tableName);

    if (!data.headers || !data.headers.length) {
        return Promise.resolve("nothing to do");
    }

    // drop existing table
    const stack = [];

    if (dropTable) {
        stack.push("DROP TABLE IF EXISTS `" + tableName + "`");

        // create table & columns
        const arr = ["`id` INTEGER PRIMARY KEY"];
        for (let i in data.headers) {
            arr.push("`" + data.headers[i] + "` TEXT"); // store all as text
        }
        stack.push(
            "CREATE TABLE `" + tableName + "` (" + arr.join(", ") + ")"
        );
    }

    // insert data
    const len = data.headers.length + 1; // +1 for id column
    const placeHolders = new Array(len).fill("?").join(",");
    const insert =
        "INSERT INTO `" + tableName + "` VALUES (" + placeHolders + ")";

    for (let i in data.data) {
        let row = data.data[i];
        stack.push([insert, [i].concat(row)]);
    }

    ////console.log(stack);
    let recordsave = db.sqlBatch(stack)
    return recordsave;
    return db.transaction((trans) => {
        return trans.sqlBatch(stack, [], (trans, results) => {
            ////console.log(results)
            return results;
        });
    })
}



export const getData = (objectId, viewColumns = [], query = "", limits = null) => {
    let tableName = "superselect_" + objectId;
    ////console.log("Query table %s with %s", tableName, query);

    if (query) {
        // get columns
        let sql = "PRAGMA table_info('" + tableName + "')";

        return new Promise((resolve, reject) => {
            return db.transaction((trans) => {
                return trans.executeSql(sql, [], (trans, tableInfo) => {
                    //// console.log("Got columns of table %s", tableName);
                    //// console.log(tableInfo);
                    const tmp = [];
                    const variants = splitCaseVariants(query);
                    const params = [];
                    for (let i = 0; i < tableInfo.rows.length; i++) {
                        let row = tableInfo.rows.item(i);
                        if (
                            !viewColumns.length ||
                            viewColumns.indexOf(row.name) != -1
                        ) {
                            variants.forEach((v) => {
                                tmp.push("`" + row.name + "` LIKE ?");
                                params.push("%" + v + "%");
                            });
                        }
                    }

                    let sql =
                        "SELECT * FROM `" + tableName + "` WHERE " + tmp.join(" OR ");

                    if (limits) {
                        sql += " LIMIT " + limits.limit + " OFFSET " + limits.offset;
                    }
                    //// console.log("Superselect query", sql, params);

                    return trans.executeSql(sql, params, (trans, data) => {
                        let rows = [];
                        for (let i = 0; i < data.rows.length; i++) {
                            rows.push(data.rows.item(i));
                        }
                        //// console.log("Superselect result", rows);
                        return resolve(rows);
                    })

                })
            })
        })
    } else {
        // get all
        let sql = "SELECT * FROM `" + tableName + "`";

        if (limits) {
            sql += " LIMIT " + limits.limit + " OFFSET " + limits.offset;
        }
        return new Promise((resolve, reject) => {
            return db.transaction((trans) => {
                return trans.executeSql(sql, [], (trans, data) => {

                    // for (let i = 0; i < data.rows.length; i++) {
                    //   //  console.log(data.rows.item(i));
                    // }
                    let rows = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        rows.push(data.rows.item(i));
                    }
                    // //  console.log("Superselect result", rows);
                    return resolve(rows);
                },
                    (error) => {
                        //  console.error('error',error)
                        reject(error)
                    });
            });
        });
    }
}


export const splitCaseVariants = (term) => {
    let upper = term.toUpperCase();
    let lower = term.toLowerCase();
    let variants = [""];
    let splits = 0;
    let maxSplits = 3;

    for (let i = 0; i < term.length; ++i) {
        let o = term[i];
        let u = upper[i];
        let l = lower[i];

        if ((l >= "a" && l <= "z") || u === l || splits >= maxSplits) {
            for (let j = 0; j < variants.length; ++j) {
                variants[j] += o;
            }
        } else {
            ++splits;
            const newVariants = [];
            for (let j = 0; j < variants.length; ++j) {
                newVariants.push(variants[j] + u);
                variants[j] += l;
            }
            variants = variants.concat(newVariants);
        }

        //// console.log(variants);
    }

    return variants;
}