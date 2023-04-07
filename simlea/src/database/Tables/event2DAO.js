
const initialState = {
    tableName: string = "event2user",
    tableColumns: {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "event_id": "INTEGER",
        "user_id": "INTEGER",
    },
    foreignKeys: [
        "FOREIGN KEY(`event_id`) REFERENCES `event`(`id`)",
        "FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)"
    ]
  };


  export const EVENT2_TABLE_NAME = initialState.tableName;
  export const EVENT2_TABLE_CALUMNS = initialState.tableColumns;
  export const EVENT2_TABLE_CALUMNS_FOREIGNKEYS = initialState.foreignKeys;
