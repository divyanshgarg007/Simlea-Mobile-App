/* eslint-disable prettier/prettier */
import * as authActions from './authActions';
import * as eventActions from './eventActions';
import * as employeeActions from './employeeActions';
import * as appComponentAction from './appComponentAction';
export const ActionCreators = Object.assign(
  {},
  authActions,
  eventActions,
  employeeActions,
  appComponentAction
);


// App
// :
// "Ralph Lee"
// Test
// :
// ""
// barcode
// :
// ""
// contact_checked
// :
// 0
// defaultLanguage
// :
// "en"
// default_language
// :
// null
// deleted
// :
// 0
// deleted_by
// :
// null
// description
// :
// null
// draft
// :
// 1
// elements
// :
// "[{\"id\":1830251,\"name\":\"App\",\"type\":\"user\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"size\":null,\"items\":[]}},{\"id\":1830545,\"name\":\"\",\"type\":\"checked\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"hideLabel\":false,\"children\":[],\"value\":null,\"checked\":null,\"confirm\":null},{\"id\":1830546,\"name\":\"barcode\",\"type\":\"badge\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"items\":[]},\"map\":{\"salutation\":\"salutation\",\"fullname\":\"fullname\",\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"title\":\"title\",\"company\":\"company\",\"position\":\"position\",\"department\":\"department\",\"street\":\"street\",\"street_only\":\"street_only\",\"number\":\"number\",\"city\":\"city\",\"zip\":\"zip\",\"city_only\":\"city_only\",\"country\":\"country\",\"country_iso\":\"country_iso\",\"phone\":\"phone\",\"fax\":\"fax\",\"mobile\":\"mobile\",\"email\":\"email\",\"web\":\"web\",\"language\":\"language\"}},{\"id\":1837049,\"name\":\"Test\",\"type\":\"superselect\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"multiple\":null,\"tooltip\":{\"items\":[]},\"objektId\":1837049,\"map\":[]},{\"id\":3672281,\"name\":\"Container\",\"type\":\"collection\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"hideLabel\":false,\"tooltip\":{\"items\":[]},\"children\":[{\"id\":3672256,\"name\":\"Photo\",\"type\":\"photo\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"items\":[]}},{\"id\":3672244,\"name\":\"Image\",\"type\":\"photo\",\"label\":{\"en\":\"Image\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"items\":[]}},{\"id\":3671715,\"name\":\"HiddenField\",\"type\":\"hidden\",\"label\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"12345\",\"hideLabel\":false,\"config\":null,\"showInEditor\":true},{\"id\":3671724,\"name\":\"emailLanguage\",\"type\":\"emaillanguage\",\"label\":{\"en\":\"Email Language\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"size\":null,\"items\":[]},\"pool\":\"en,de,fr,es\",\"langOpts\":{\"en\":[{\"text\":\"English\",\"value\":\"en\"},{\"text\":\"German\",\"value\":\"de\"},{\"text\":\"French\",\"value\":\"fr\"},{\"text\":\"Spanish\",\"value\":\"es\"}]}},{\"id\":3671723,\"name\":\"emailAddress\",\"type\":\"email\",\"label\":{\"en\":\"Email Address\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":false,\"value\":\"\",\"hideLabel\":false,\"config\":null,\"tooltip\":{\"size\":null,\"items\":[]}},{\"id\":3672334,\"name\":\"sendMail\",\"type\":\"sendmail\",\"label\":{\"en\":\"Send Mail\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"placeholder\":{\"en\":\"\",\"de\":\"\",\"it\":\"\",\"fr\":\"\",\"es\":\"\",\"ru\":\"\",\"nl\":\"\",\"ja\":\"\",\"pl\":\"\"},\"required\":true,\"value\":false,\"hideLabel\":false,\"config\":null,\"tooltip\":{\"size\":null,\"items\":[]}}]}]"
// eventId
// :
// 1830249
// event_id
// :
// 1830249
// fallbackLanguage
// :
// "en"
// fallback_language
// :
// null
// form_id
// :
// 1
// guid
// :
// "1834ea71-b1b7-4224-a613-6b0602e46489"
// id
// :
// 82
// languages
// :
// "{\"en\":\"Englisch\"}"
// lead_id
// :
// "TE20222-Test1-26"
// lead_lang
// :
// "en"
// modified
// :
// 1
// name
// :
// "IAA Form"
// production
// :
// 1
// randomKey
// :
// "c2c382c14464669242ece387bf1834c8"
// random_key
// :
// null
// remoteId
// :
// 1830250
// remote_id
// :
// 0
// rowid
// :
// 1
// searchColumns
// :
// "[\"\"]"
// search_columns
// :
// null
// selected_user_id
// :
// ""
// server_timestamp
// :
// null
// shortCode
// :
// "Test1"
// short_code
// :
// null
// sync_on
// :
// 0
// timestamp
// :
// 1679374616814
// user_id
// :
// 1711259
// version
// :
// 24
// viewColumns
// :
// "[\"timestamp\",\"lead_id\",\"sync_on\",\"\"]"
// view_columns
// :
// null
// waitlist_user_id
// :
// null 
