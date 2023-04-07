import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
import { DATABASE } from "./Constants";
import { AppState, AppStateStatus } from "react-native";
import { DatabaseInitialization } from "./DatabaseInitialization";
import { EVENT_TABLE_CALUMNS, EVENT_TABLE_NAME } from './Tables/eventDAO';
import { USER_TABLE_CALUMNS, USER_TABLE_NAME } from './Tables/userDao';
import { EVENT2_TABLE_CALUMNS, EVENT2_TABLE_CALUMNS_FOREIGNKEYS, EVENT2_TABLE_NAME } from './Tables/event2DAO';
import { FORM_TABLE_CALUMNS, FORM_TABLE_CALUMNS_FOREIGNKEYS, FORM_TABLE_NAME } from './Tables/formDao';
import { FORM2USER_TABLE_CALUMNS, FORM2USER_TABLE_CALUMNS_FOREIGNKEYS, FORM2USER_TABLE_NAME } from './Tables/form2UserDao';
import { RECORD2USER_TABLE_CALUMNS, RECORD2USER_TABLE_CALUMNS_FOREIGNKEYS, RECORD2USER_TABLE_NAME } from './Tables/record2UserDao';
import { FILE_TABLE_CALUMNS, FILE_TABLE_CALUMNS_FOREIGNKEYS, FILE_TABLE_NAME } from './Tables/fileDao';
import { UPLOAD_TABLE_CALUMNS, UPLOAD_TABLE_CALUMNS_FOREIGNKEYS, UPLOAD_TABLE_NAME } from './Tables/uploadDao';
import NetInfo from "@react-native-community/netinfo";
let databaseInstance = SQLite.SQLiteDatabase | undefined;

// "Private" helpers database
export const getDatabase = async () => {
  console.log("this is outside iff");

  console.log(SQLite.SQLiteDatabase);
  if (SQLite.SQLiteDatabase !== undefined && SQLite.SQLiteDatabase != 0) {
    console.log("this is inside iff");
    let data = SQLite.SQLiteDatabase
    return Promise.resolve(data);
  }
  // otherwise: open the database first
  return open();
}

// Open a connection to the database
export const open = async () => {
  //  SQLite.DEBUG(true);
  //  SQLite.enablePromise(true);


  //[db] Database is already open: returning the existing instance");
  if (databaseInstance) {
    return databaseInstance;
  }

  // Otherwise, create a new instance
  const db = await SQLite.openDatabase({
    name: DATABASE.BACKUP_FILE_NAME,
    location: "default",
  });


  //console.log("[db] Database open!");
  DATABASE.DB_INSTANCE = db;
  // Perform any database initialization or updates, if needed
  const databaseInitialization = new DatabaseInitialization();
  databaseInitialization.createTables(db, EVENT_TABLE_NAME, EVENT_TABLE_CALUMNS, null, false);
  databaseInitialization.createTables(db, USER_TABLE_NAME, USER_TABLE_CALUMNS, null, false);
  databaseInitialization.createTables(db, EVENT2_TABLE_NAME, EVENT2_TABLE_CALUMNS, EVENT2_TABLE_CALUMNS_FOREIGNKEYS, false);
  databaseInitialization.createTables(db, FORM_TABLE_NAME, FORM_TABLE_CALUMNS, FORM_TABLE_CALUMNS_FOREIGNKEYS, false);
  databaseInitialization.createTables(db, FORM2USER_TABLE_NAME, FORM2USER_TABLE_CALUMNS, FORM2USER_TABLE_CALUMNS_FOREIGNKEYS, false);
  databaseInitialization.createTables(db, RECORD2USER_TABLE_NAME, RECORD2USER_TABLE_CALUMNS, RECORD2USER_TABLE_CALUMNS_FOREIGNKEYS, false);
  databaseInitialization.createTables(db, FILE_TABLE_NAME, FILE_TABLE_CALUMNS, FILE_TABLE_CALUMNS_FOREIGNKEYS, false);
  databaseInitialization.createTables(db, UPLOAD_TABLE_NAME, UPLOAD_TABLE_CALUMNS, UPLOAD_TABLE_CALUMNS_FOREIGNKEYS, false);

  // await 
  databaseInstance = db;
  return Promise.resolve(db);
  // return db;
}


// Close the connection to the database
export const close = async () => {
  if (databaseInstance === undefined) {
    //console.log("[db] No need to close DB again - it's already closed");
    return;
  }
  const status = await databaseInstance.close();
  //console.log("[db] Database closed.");
  databaseInstance = undefined;
}

// Listen to app state changes. Close the database when the app is put into the background (or enters the "inactive" state)
let appState = "active";
//console.log("[db] Adding listener to handle app state changes");
//AppState.addEventListener("change", handleAppStateChange);

// Handle the app going from foreground to background, and vice versa.
function handleAppStateChange(nextAppState) {
  //console.log('App state', appState)
  if (appState === "active" && nextAppState.match(/inactive|background/)) {
    // App has moved from the foreground into the background (or become inactive)
    //console.log("[db] App has gone to the background - closing DB connection.");
    // close();
  }
  appState = nextAppState;
}

// const unsubscribe = NetInfo.addEventListener(state => {
//   //console.log("Connection type", state.type);
//   //console.log("Is connected?", state.isConnected);
//   DATABASE.NETWORK_CONNECTION = state.isConnected;
// });
// unsubscribe();




isNetworkAvailable = async () => {
  const response = await NetInfo.fetch();
  DATABASE.NETWORK_CONNECTION = response.isConnected;
}
isNetworkAvailable();


export const getNetwork = async () => {
  const response = await NetInfo.fetch();
  return response.isConnected;
}
