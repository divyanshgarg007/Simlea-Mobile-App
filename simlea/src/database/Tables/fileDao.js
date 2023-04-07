

const initialState = {
tableName: "file",
tableColumns: {
    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
    "event_id": "INTEGER",
    "form_id": "INTEGER",
    "path": "TEXT", // virtual path
    "modified": "INTEGER", // timestamp last modified
    "size": "INTEGER", // file size
    "mime_type": "TEXT",
    "icon": "TEXT", // from MIME-type?
    "url": "TEXT", // download URL
    "file": "TEXT" // local filesystem path
},
foreignKeys: ["FOREIGN KEY(`event_id`) REFERENCES `event`(`id`)"]
}


export const FILE_TABLE_NAME = initialState.tableName;
export const FILE_TABLE_CALUMNS = initialState.tableColumns;
export const FILE_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;
