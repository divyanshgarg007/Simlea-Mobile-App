import { DATABASE } from "../../database/Constants";
import SQLite from "react-native-sqlite-storage";
import BcryptReactNative from 'react-native-bcrypt';
import { setToken } from "../../Utilities/util";
import * as UtilitySysService from '../../database/UtilityService'



const initialState = {
    tableName: "user",
    tableColumns: {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "remote_id": "INTEGER", // id on server
        "username": "TEXT", // assumes username != email
        "token": "TEXT",
        "hash": "TEXT", // password hash
        "email": "TEXT",
        "firstname": "TEXT",
        "lastname": "TEXT",
        "lang": "TEXT",
        "company": "TEXT", // name of company
        "company_logo": "TEXT", // filepath of company logo
        "companyLogo": "TEXT",
        "user_image": "TEXT", // filepath of user image
        "userImage": "TEXT", // filepath of user image
        "status": "TEXT", // user available?
        "modules": "TEXT", // activated modules
        "last_login": "INTEGER", // last local login
        "valid_from": "INTEGER", // token generation time on server
        "valid_to": "INTEGER", // valid-to timestamp from server
        "customer_id": "INTEGER",
        "device_num": "TEXT",
        "random_key": "TEXT",
        "back_sync": "INTEGER", // can see leads of other users?
        "draft_mode": "INTEGER " // can create draftsNOT NULL DEFAULT 0

    }
}

const db = SQLite.openDatabase({ name: DATABASE.BACKUP_FILE_NAME, createFromLocation: 1 }, () => { });
/**
 * Execute sql queries
 * 
 * @param eventId
 * @param username
 * 
 * @returns {resolve} results
 */
export const getUserByEventAndName = (eventId, username) => {
    let sql = "SELECT u.* FROM `" + USER_TABLE_NAME + "` u LEFT JOIN event2user e2u ON e2u.user_id = u.id WHERE e2u.event_id = ? AND u.username = ?";
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [eventId, username], (trans, results) => {
                if (results.rows.length === 0) {
                    resolve(null)
                }
                else {
                    let row = results.rows.item(0);
                    //console.log('dadad',row)
                    resolve(row)
                }
            },
                (error) => {
                    //console.log('error',error)
                    reject(error)
                });
        });
    });
};


/**
  * Execute sql queries
  * 
  * @param remoteId
  * 
  * @returns {resolve} results
  */
export const getByRemoteId = (remoteId) => {
    let sql = "SELECT * FROM `" + USER_TABLE_NAME + "` WHERE remote_id = ?";

    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [remoteId], (trans, results) => {
                if (results.rows.length === 0) {
                    return resolve(null)
                }
                else {
                    let row = results.rows.item(0);
                    return resolve(row)
                }
            },
                (error) => {
                    console.log('error',error)
                    resolve(error)
                });
        });
    });
}



/**
  * Execute sql queries
  * 
  * @param eventid
  * @param username
  * @param password
  * @param responseData
  * 
  * @returns {resolve} results
  */
export const populateUserObject = async (eventid, username, password, responseData) => {


    let d;
    let newUser = {
        id: responseData.id,
        remote_id: responseData.id,
        username: username,
        firstname: responseData.firstname,
        lastname: responseData.lastname,
        email: responseData.email,
        token: responseData.token,
        lang: responseData.lang,
        company: responseData.company,
        company_logo: "", // assets/imgs/demo-company.svg
        customer_id: responseData.customerId,
        device_num: responseData.deviceNum,
        random_key: responseData.randomKey,
        last_login: new Date().getTime(),
        back_sync: responseData.backSync,
        draft_mode: responseData.draftMode,
        status: responseData.status,
        modules: Array.isArray(responseData.modules) ? responseData.modules.join(",") : "",
        valid_from: (d = new Date(responseData.validFrom))
            ? d.getTime()
            : new Date().getTime(),
        valid_to: (d = new Date(responseData.validTo))
            ? d.getTime()
            : new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
    };

    setToken('status-options', JSON.stringify(responseData.statusOptions))
    let passHash = await passwordHash(password);
    newUser['hash'] = passHash;

    await updateUserImage(newUser, "companyLogo", responseData.companyLogo, false);
    await updateUserImage(newUser, "userImage", responseData.userImage, false);
    await save(newUser);
    return responseData;

};



/**
  * Execute sql queries
  * 
  * @param eventid
  * @param username
  * @param password
  * @param responseData
  * 
  * @returns {resolve} results
  */
export const createNewUser = async (eventid, username, password, responseData) => {

    //console.log('responseData', responseData)
    let user = responseData.id

    let d;
    let newUser = {
        id: responseData.id,
        remote_id: responseData.id,
        username: username,
        firstname: responseData.firstname,
        lastname: responseData.lastname,
        email: responseData.email,
        token: responseData.token,
        lang: responseData.lang,
        company: responseData.company,
        company_logo: "", // assets/imgs/demo-company.svg
        customer_id: responseData.customerId,
        device_num: responseData.deviceNum,
        random_key: responseData.randomKey,
        last_login: new Date().getTime(),
        back_sync: responseData.backSync,
        draft_mode: responseData.draftMode,
        status: responseData.status,
        modules: Array.isArray(responseData.modules) ? responseData.modules.join(",") : "",
        valid_from: (d = new Date(responseData.validFrom))
            ? d.getTime()
            : new Date().getTime(),
        valid_to: (d = new Date(responseData.validTo))
            ? d.getTime()
            : new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
    };

    //console.log(eventid, username, password, newUser)


    setToken('status-options', JSON.stringify(responseData.statusOptions))
    let passHash = await passwordHash(password);
    newUser['hash'] = passHash;

    await updateUserImage(newUser, "companyLogo", responseData.companyLogo, false);
    await updateUserImage(newUser, "userImage", responseData.userImage, false);
    await save(newUser);
    await addUserToEvent(user, eventid);
    let getRecord = await getRow(user);
    return getRecord;
}




export const getRow = (id) => {
    let sql = "SELECT * FROM `" + USER_TABLE_NAME + "` WHERE id = ?";
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [id], (trans, results) => {
                if (results.rows.length === 0) { return reject(null); }
                else { resolve(results.rows.item(0)) }
            },
                (error) => {
                    //console.log('error',error)
                    reject(error)
                });
        });
    });
}


export const save = async (model) => {
    let row = {};


    let sql = "SELECT * FROM `" + USER_TABLE_NAME + "` WHERE id = ?";
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [model.id], async (trans, results) => {
                if (results.rows.length === 0 && results) {
                    let saveResUpdate = await insertRow(model, model.id)
                    //console.log('saveResUpdate',saveResUpdate)
                    resolve(true)
                }
                else {
                    let insertResUpdate = await updateRow(model, model.id)
                    //console.log('insertResUpdate',insertResUpdate)
                    resolve(true)
                }
            },
                (error) => {
                    //console.log('error',error)
                    reject(error)
                });
        });
    });
}


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

    let sql = "INSERT INTO `" + USER_TABLE_NAME + "` (" + fields.join(",") + ") VALUES (" + placeholders.join(",") + ")";
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

   // console.log(fields.join(","), params)

    let sql = "UPDATE `" + USER_TABLE_NAME + "` SET " + fields.join(",") + " WHERE id = ?";
    //console.log(["updateObject %s", USER_TABLE_NAME,sql, params]);


    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, params, (trans, results) => {
                // console.log(results)
                // let sql1 = "SELECT * FROM " + USER_TABLE_NAME;
                //  trans.executeSql(sql1, [], (trans, results1) => {
                //     for (let i = 0; i < results1.rows.length; ++i) {
                //         let row = results1.rows.item(i);
                //         console.log(row)
                //       }
                // })

                return resolve(row.id)
            },
                (error) => {
                    console.error('error %s', USER_TABLE_NAME ,error)
                    resolve(true)
                });
        });
    });
}


export const addUserToEvent = (userId, eventId) => {
    // check if already added
    // if(userId === undefined) {
    //     userId = 0;
    // }
    //console.log("event2user: userId %s eventId %s", userId, eventId);
    let sql = "SELECT * FROM `event2user` WHERE user_id = ? AND event_id = ?";
    return new Promise((resolve, reject) => {
        return db.transaction((trans) => {
            return trans.executeSql(sql, [userId, eventId], (trans, results) => {
                //console.log(results.rows.length, results)
                if (results.rows.length === 0) {
                    let insert = "INSERT INTO `event2user` (user_id,event_id) VALUES (?,?)";
                    return trans.executeSql(insert, [userId, eventId], (trans1, results1) => {
                        //console.log(results1)

                        trans.executeSql("SELECT * FROM event2user", [], async (trans, results1) => {
                            //console.log(results1, results1.rows.item(0))
                        })

                        return resolve(results1)
                    },
                        (error) => {
                            //console.log('error event2user',error)
                        });
                } else {
                    return resolve(true)
                }
            },
                (error) => {
                    //console.log('error',error)
                    return reject(error)
                });
        });
    });
}

export const passwordHash = (password) => {
    return new Promise((resolve, reject) => {
        return BcryptReactNative.hash(password, 8, function (err, hash) {
            resolve(hash);
        });
    });
}

export const paawordcompire = (password, resPassword) => {
    return new Promise((resolve, reject) => {
        return BcryptReactNative.compare(password, resPassword, function (err, res) {
            resolve(res);
        });
    });
}

export const updateUserImage = async (user, key, logo, saveUser = true) => {
    if (!logo || !logo.data || !logo.data.length) {
        //console.log(key + ":  No image data");
        return;
    }

    let prefix = "company-logo-";
    if (key == "userImage") {
        prefix = "user-image-";
    }
    let filename = prefix + user.remote_id + "." + logo.extension;
    user[key] = await UtilitySysService.saveImageFromBase64(
        "images",
        filename,
        logo.data
    );

    if (saveUser) {
        return await this.userDao.save(user);
    }
}



export const USER_TABLE_NAME = initialState.tableName;
export const USER_TABLE_CALUMNS = initialState.tableColumns;