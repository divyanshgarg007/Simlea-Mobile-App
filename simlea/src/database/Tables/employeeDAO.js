import SQLite from "react-native-sqlite-storage";
import { APLLICATION_RECORD, DATABASE } from "../Constants";


const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });


export const initTable = (data) => new Promise(async (resolve, reject) => {

    let tableName = "employee_" + APLLICATION_RECORD.APP_EVENT_ID;
    // drop existing table
    const stack = ["DROP TABLE IF EXISTS `" + tableName + "`"];
    // create table & columns
    const arr = [
        "`id` INTEGER PRIMARY KEY",
        "`firstname` TEXT",
        "`lastname` TEXT",
        "`email` TEXT",
        "`user_image` TEXT",
        "`status` TEXT",
        "`forms` TEXT",
        "`events` TEXT",
        "`schedule` TEXT"
    ];

    stack.push("CREATE TABLE `" + tableName + "` (" + arr.join(", ") + ")");

    // insert data
    const insert = "INSERT INTO `" + tableName + "` VALUES (?,?,?,?,?,?,?,?,?)";

    for (let i in data) {
        if (!data.hasOwnProperty(i)) {
            continue;
        }
        let cur = data[i], forms = [], events = [];
        if (cur.hasOwnProperty('forms') && Array.isArray(cur.forms)) {
            forms = cur.forms;
        }
        if (cur.hasOwnProperty('events') && Array.isArray(cur.events)) {
            events = cur.events;
        }
        let params = [
            cur.id,
            cur.firstName,
            cur.lastName,
            cur.email,
            cur.userImage,
            cur.status,
            forms.join(","),
            events.join(","),
            JSON.stringify(cur.schedule)
        ];
        stack.push([insert, params]);
    }

    // console.log(stack);
    let dat6a = await db.sqlBatch(stack);
    return resolve(dat6a);

    return db.transaction((trans) => {
        // alert('results'+ tableName)
        return trans.executeSql("SELECT * FROM " + tableName, [], (trans, results) => {
            //  console.log('stack', results)
            alert(results)
            return resolve(results);
        },
            (error) => {
                console.log('error', error)
                alert(error)
                reject(error)
            });
    })


});


export const getData = (query = "") => {
    let tableName = "employee_" + APLLICATION_RECORD.APP_EVENT_ID;
    //console.log("Query table %s with %s", tableName, query);

    let sql = "SELECT * FROM `" + tableName + "`";
    let params = [];

    if (query) {
        const tmp = [
            "`firstname` LIKE ?",
            "`lastname` LIKE ?",
            "`email` LIKE ?"
        ];
        sql += " WHERE " + tmp.join(" OR ");
        params = new Array(tmp.length).fill("%" + query + "%");
    }
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, params, (trans, data) => {
                let rows = [];
                for (let i = 0; i < data.rows.length; i++) {
                    data.rows.item(i)['lastName'] = data.rows.item(i).lastname;
                    data.rows.item(i)['firstName'] = data.rows.item(i).firstname;
                    rows.push(data.rows.item(i));
                }
                // console.log("Employee result", rows);
                return resolve(rows);
            },
                (error) => {
                    // console.error('error',error)
                    return resolve([])
                });
        })
    })

    // return this.db.executeSql(sql, params).then(data => {
    //     let rows = [];
    //     for (let i = 0; i < data.rows.length; i++) {
    //         rows.push(data.rows.item(i));
    //     }
    //     console.log("Employee result", rows);
    //     return rows;
    // });
}

