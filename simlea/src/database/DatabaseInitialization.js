import SQLite from "react-native-sqlite-storage";
import * as connection from './DBConnection';
import { DATABASE } from "./Constants";

let dbInit = SQLite.SQLiteDatabase | undefined;

export class DatabaseInitialization {
  /**
      * 
       @param {} tableName 
       @param {} tableColumns 
      */
  // Perform initial setup of the database tables
  createTables = (db, tableName, tableColumns, foreignKeys, dropAllTables = false) => {
    dbInit = db
    // For dev only
    if (dropAllTables) {
      db.executeSql("DROP TABLE IF EXISTS tablename;");
    }
    let arr = [];
    let statement = '';
    for (let i in tableColumns) {
      arr.push("" + i + " " + tableColumns[i]);
    }
    if (foreignKeys != undefined && foreignKeys != null && foreignKeys != '') {
      for (let i in foreignKeys) {
        arr.push(foreignKeys[i]);
      }
    }
    let tableQuery = "CREATE TABLE IF NOT EXISTS " + tableName;
    let tableColumnQuery = arr.join(", ");
    statement = tableQuery + "(" + tableColumnQuery + ")";
    db.executeSql(statement, [], (tx, results) => {
      alertTable(tableName, tableColumns)
    },
      (error) => {
        // console.log('Unable to create table: %s has error: %s', tableName, error);
      });

    return;
  }
}


alertTable = async (tableName, tableColumns) => {
  return await AlterTableExecuteQuery("PRAGMA table_info('" + tableName + "')", [], tableColumns, tableName);
}

/**
* Execute sql queries
* 
* @param sql
* @param params
* 
* @returns {resolve} results
*/
export const AlterTableExecuteQuery = (sql, params = [], tableColumns, tableName) => new Promise((resolve, reject) => {
  dbInit.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
      const existingColumns = {};
      const promises = [];
      for (let i = 0; i < results.rows.length; i++) {
        let row = results.rows.item(i);
        existingColumns[row.name] = row;
      }

      for (let i in tableColumns) {
        if (existingColumns[i]) continue; // skip existing

        // add new ones
        sql = "ALTER TABLE " + tableName + " ADD COLUMN `" + i + "` " + tableColumns[i];
        let promise = trans.executeSql(sql, []).then((data) => {
          // console.log("Add column successful");
          return data;
        }, (err) => {
          // console.log("Add column failed");
          return err;
        });
        promises.push(promise);
      }

      if (!promises.length) {
        //console.log("No new columns for table %s, nothing to do", tableName);
      }
      resolve(promises);
    },
      (error) => {
        // console.error(error)
        resolve(error);
      });
  });
});





/**
* Execute sql queries
* 
* @param sql
* @param params
* 
* @returns {resolve} results
*/
ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
      resolve(results);
    },
      (error) => {
        reject(error);
      });
  });
});




