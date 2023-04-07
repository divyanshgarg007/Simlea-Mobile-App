import SQLite from 'react-native-sqlite-storage';
import {APLLICATION_RECORD, DATABASE} from '../Constants';
import * as UtilitySysService from '../../database/UtilityService';
import {EVENT_ACTION_TYPES} from '../../redux/action/actionsType';
import {setToken} from '../../Utilities/util';

const initialState = {
  tableName: 'event',
  tableColumns: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    remote_id: 'INTEGER',
    name: 'TEXT',
    description: 'TEXT',
    logo: 'TEXT',
    company_logo: 'TEXT',
    companyLogo: 'TEXT',
    short_code: 'TEXT',
    config: 'TEXT',
    modified: 'INTEGER NOT NULL DEFAULT 0',
    deleted: 'INTEGER NOT NULL DEFAULT 0',
    is_demo: 'INTEGER NOT NULL DEFAULT 0',
  },
  // Event2 add as foreign key this primary key
};

const db = SQLite.openDatabase(
  {name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1},
  () => {},
);

export const getEventByEventId = (data, code, dispatch) => {
  //console.log('daaaaaao open');

  // console.log(data);
  // console.log(code);

  let logo = data?.data?.logo;
  let companyLogo = data?.data?.companyLogo;
  if (data?.data?.deviceNum) {
    setToken('device-num', data?.data?.deviceNum);
    //Utility.setDeviceNum(data.deviceNum, data.customer_id);
  }
  let isExit = false;
  return new Promise((resolve, reject) => {
    return db.transaction(
      trans => {
        let sqlQuery =
          'SELECT rowid AS rowid ,*   FROM `' +
          EVENT_TABLE_NAME +
          '` WHERE remote_id = ?';
        trans.executeSql(
          sqlQuery,
          [data?.data.eventId],
          async (tx, results) => {
            let res = results.rows.length ? results.rows.item(0) : null;

            if (res != null) {
              isExit = true;
              if (res.deleted != 1) {
                getEventList(dispatch);
                return resolve(true);
              }
            }
            return resolve(
              await insertEventRow(
                data,
                code,
                logo,
                companyLogo,
                isExit,
                dispatch,
                results.rows.item(0),
              ),
            );
          },
        );
      },
      error => {
        console.error('getEventByEventId error', error);
        resolve('databaseerror');
        return error;
      },
    );
  });
};

/**
 * Execute event list queries
 *
 *
 * @returns {resolve} results
 */
export const getEventList = (dispatch, includeDeleted = false) => {
  // const db = SQLite.openDatabase(
  //   { name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 },
  //   () => { },
  // );
  db.transaction(trans => {
    let sqlQuery = 'SELECT * FROM ' + EVENT_TABLE_NAME;
    if (!includeDeleted) {
      sqlQuery += ' WHERE deleted != 1';
    }
    trans.executeSql(
      sqlQuery,
      [],
      (trans, results) => {
        var resultItemIdArr = new Array();
        for (let i = 0; i < results.rows.length; i++) {
          resultItemIdArr.push(results.rows.item(i));
        }
        console.log('resultItemIdArr', resultItemIdArr);
        dispatch(checkEventSuccess(resultItemIdArr));
      },
      error => {
        console.log(error);
      },
    );
  });
};

// export const getEventList = () => new Promise((resolve, reject), async dispatch => {
//   db.transaction((trans) => {
//     let sqlQuery =  "SELECT * FROM "+EVENT_TABLE_NAME;
//     trans.executeSql(sqlQuery, [], (trans, results) => {
//       var resultItemIdArr = new Array();
//       for (let i = 0; i < results.rows.length; i++) {
//           resultItemIdArr.push(results.rows.item(i));
//           console.log(results.rows.item(i));
//       }
//       alert(resultItemIdArr)
//       dispatch(checkEventSuccess(resultItemIdArr))
//       resolve(resultItemIdArr);
//     },
//       (error) => {
//         reject(error);
//       });
//   });
// });

const checkEventSuccess = data => {
  return {
    type: EVENT_ACTION_TYPES.SQL_EVENT_LIST_SUCCESS,
    payload: data,
  };
};

export const insertEventRow = async (
  data,
  code,
  logo,
  companyLogo,
  isExit,
  dispatch,
  results,
) => {
  let fields = [];
  let params = [];
  let placeholders = [];
  let row = {};
  // console.log('rowrowrowrowrowrow', row);
  if (isExit) {
    row = {
      name: data.data.name,
      remote_id: data.data.eventId,
      short_code: data.data.shortCode || '',
      config: data.data.appConfig || '{}',
      deleted: results.deleted === 0 ? 1 : 0,
      is_demo: code === 'demo',
    };
  } else {
    row = {
      name: data.data.name,
      remote_id: data.data.eventId,
      short_code: data.data.shortCode || '',
      config: data.data.appConfig || '{}',
      deleted: 0,
      is_demo: code === 'demo' ? 1 : 0,
    };
  }

  const db = SQLite.openDatabase(
    {name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1},
    () => {},
  );

  //console.log('rowrowrowrowrowrow', row);

  await UtilitySysService.updateLogo(row, 'logo', logo);
  await UtilitySysService.updateLogo(row, 'companyLogo', companyLogo);

  await UtilitySysService.updateLogo(row, 'logo', logo);
  await UtilitySysService.updateLogo(row, 'companyLogo', companyLogo);

  return new Promise((resolve, reject) => {
    return db.transaction(async trans => {
      //  console.log('event of ????', row);
      for (let column in row) {
        if (row.hasOwnProperty(column)) {
          fields.push('`' + column + '`');
          params.push(row[column]);
          placeholders.push('?');
        }
      }

      let sql =
        'INSERT INTO `' +
        EVENT_TABLE_NAME +
        '` (' +
        fields.join(',') +
        ') VALUES (' +
        placeholders.join(',') +
        ')';
      trans.executeSql(
        sql,
        params,
        async (tx, results) => {
          // console.log('Table: %s ', EVENT_TABLE_NAME, JSON.stringify(results));
          getEventList(dispatch);
          return resolve(true);
        },
        error => {
          //console.log('Table: %s ', EVENT_TABLE_NAME, JSON.stringify(error));
        },
      );
    });
  });
};

/**
 * Delete
 */
export const deleteEventByID = async (id, dispatch) => {
  // let sql = 'UPDATE `' + EVENT_TABLE_NAME + '` SET deleted = 1 WHERE id = ?';
  let sql = 'DELETE  FROM`' + EVENT_TABLE_NAME + '` WHERE id = ?';
  return await ExecuteQuery(sql, [id], dispatch);
};

/**
 * Execute sql queries
 *
 * @param sql
 * @param params
 *
 * @returns {resolve} results
 */
export const ExecuteQuery = (sql, params = [], dispatch) =>
  new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          getEventList(dispatch);
          resolve(true);
        },
        error => {
          reject(error);
        },
      );
    });
  });

export const getSingleEventListByEventId = async id => {
  await db.transaction(async trans => {
    let sqlQuery =
      'SELECT * FROM `' + EVENT_TABLE_NAME + '` WHERE remote_id = ?';
    trans.executeSql(sqlQuery, [id], async (tx, results) => {
      let res = results.rows.length ? results.rows.item(0) : null;
      if (res != null) {
        APLLICATION_RECORD.EVENT = res;
      }
    });
  });
};

export const EVENT_TABLE_NAME = initialState.tableName;
export const EVENT_TABLE_CALUMNS = initialState.tableColumns;
