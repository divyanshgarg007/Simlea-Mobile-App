import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {NAVIGATION} from '../../constants/navigation';
import {useFocusEffect} from '@react-navigation/native';

import {
  HeaderTestMode,
  Hamburger,
  HeaderButton,
  HeaderTitle,
} from '../../components';
import Home from '../../assets/images/home.png';
import {CustomTable, SearchBar, SortingList} from './component';
import {useSelector} from 'react-redux';
import {styles} from './lists.style';
import GlobalStyle from '../../style/globalstyle';
import * as formDao from '../../database/Tables/formDao';
import moment from 'moment';

export default function ListsView(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [visible, setVisible] = useState(false);
  const [eventData, setEventData] = useState(
    props?.route?.params?.data?.records,
  );

  const [sort, setSort] = useState(0);
  const [sortedData, setSortedData] = useState([]);
  const [selectedKey, setSelectedKey] = useState('lead_id');

  const [newform, setNewForm] = useState(props?.route?.params?.form);

  const [newFormColumns, setFormColumns] = useState([]);

  const [initialFormColumns, setinitialFormColumns] = useState([]);
  const [initialFormRow, setinitialFormRow] = useState([]);

  const initialState = {
    currentFormsData: [],
    items: [],
    columnsNameList: [],
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      tabBarVisible: false,
      headerBackVisible: false,
      headerShown: true,

      headerTitle: () => <HeaderTitle title={'List ' + newform.name} />,
    });
  }, [props.navigation]);

  //Product search
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    if (search?.length > 0) {
      let filterData = initialFormRow.filter(data =>
        data?.lead_id.toLowerCase().includes(search.toLowerCase()),
      );
      setSearchData(filterData);
    }
  }, [search]);

  // useEffect(() => {
  //   setFormColumns(getColumns());
  //   validateColAndGetColumns();
  // }, [props?.route?.params?.form]);

  useFocusEffect(
    useCallback(() => {
      setFormColumns(getColumns());
      validateColAndGetColumns();
    }, []),
  );

  const validateColAndGetColumns = async () => {
    let columns = newform.viewColumns || '[]';
    if (columns.length && columns[0] != '') {
      await formDao
        .validateDataColumns(newform.rowid, columns)
        .then(filteredColumns => {
          //  setFormColumns(filteredColumns)
          initialState.columnsNameList = filteredColumns;
          // console.log('validateDataColumns', initialState.columnsNameList);
          setinitialFormColumns(initialState.columnsNameList);
          loadList();
        });
    } else {
      loadList();
    }
  };

  const loadList = (infiniteScroll = null) => {
    //console.log('loadList is executed');
    let search = null;
    let limits = {
      limit: 20,
      offset: 0,
    };
    order = {
      column: 'timestamp',
      dir: 'DESC',
    };
    filters = [];

    formDao
      .getDataList(
        newform.rowid,
        initialState.columnsNameList,
        order,
        search,
        filters,
        limits,
      )
      .then(items => {
        // console.log('loadList()', items);
        items.forEach(item => {
          let tmpArr = [];
          for (let column in item) {
            tmpArr.push(item[column]);
          }
          //item._displayText = tmpArr.join(", ");
          item._data = tmpArr;
          item._displayText = getDisplayText(item);
          //formatRow(item);
          for (let column in item) {
            if (!item.hasOwnProperty(column)) {
              continue;
            }

            //let def = initialState.columnsNameList[column];
            //console.log(def)
            // console.log(newFormColumns[column]);
            //if (def) {
            let cur = item[column];

            switch (column) {
              case 'id':
                break;
              case 'timestamp':
                // parse timestamp
                let v = '';
                let d;
                if (cur) {
                  d = cur;
                  v = moment(d).format('MM/DD/YYYY HH:MM:SS');
                }
                item[column] = v;

                break;
              case 'sync_on':
                // parse timestamp
                let vv = '';
                let dd;
                if (cur) {
                  dd = cur;
                  vv = moment(d).format('MM/DD/YYYY HH:MM:SS');
                }
                item[column] = vv;
                break;
              case 'card':
              case 'photo':
                item[column] = cur.indexOf('file://') != -1 ? 'Ja' : 'Nein';
                break;
              case 'signature':
              case 'barcode':
                item[column] = cur.length ? 'Ja' : 'Nein';
                break;
              default:
                // console.log(item[column]);
                item[column] = cur.length ? cur : '(leer)';
                break;
            }
            // }
          }
        });
        initialState.items = items;
        setinitialFormRow(items);
        // console.log('from row record', initialState.items);
      });
  };

  const getDisplayText = row => {
    // console.log('getDisplayText is executed');
    let tmpArr = [];
    for (let column in row) {
      if (row[column] === null) {
        row[column] = '';
      }
      let def = newFormColumns[column];
      if (def) {
        switch (def.type) {
          case 'timestamp':
            // parse timestamp
            let d = new Date(row[column]);
            tmpArr.push(d);
            break;
          case 'card':
          case 'photo':
            tmpArr.push(row[column].indexOf('file://') != -1 ? 'Ja' : 'Nein');
            break;
          case 'signature':
          case 'barcode':
            tmpArr.push(row[column].length ? 'Ja' : 'Nein');
            break;
          default:
            tmpArr.push(row[column].length ? row[column] : '(leer)');
            break;
        }
      }
    }

    return tmpArr.join(', ');
  };

  const formatRow = row => {
    for (let column in row) {
      if (!row.hasOwnProperty(column)) {
        continue;
      }
      let def = newFormColumns[column];
      if (def) {
        let cur = row[column];
        switch (def.type) {
          case 'id':
            break;
          case 'timestamp':
            // parse timestamp
            let v = '';
            if (cur) {
              let d = new Date(cur);
              v = moment(d).format('MM/DD/YYYY HH:MM:SS');
            }
            row[column] = v;
            break;
          case 'card':
          case 'photo':
            row[column] = cur.indexOf('file://') != -1 ? 'Ja' : 'Nein';
            break;
          case 'signature':
          case 'barcode':
            row[column] = cur.length ? 'Ja' : 'Nein';
            break;
          default:
            row[column] = cur.length ? cur : '(leer)';
            break;
        }
      }
    }
  };

  const getColumns = () => {
    let ele = newform.elements ? JSON.parse(newform.elements) : '';

    const result = {
      timestamp: {
        label: 'created-on',
        type: 'timestamp',
      },
      lead_id: {
        label: 'lead-id',
        type: 'text',
      },
      sync_on: {
        label: 'sync-on',
        type: 'timestamp',
      },
    };

    const recurseElements = element => {
      //console.log('recurseElements in listview');
      if (element.hasOwnProperty('children')) {
        element.children.forEach(recurseElements);
      } else if (element.name && element.name.length) {
        if (['headline', 'calc'].indexOf(element.type) != -1) {
          return;
        }

        result[element.name] = {
          label: element.label || element.name,
          type: element.type,
        };
        element.type == 'date' &&
          (result[element.name]['format'] = element.format);
        if (element.type == 'select' || element.type == 'checkbox') {
          result[element.name]['options'] = element.options;
        }
      }
    };

    ele.length > 0 ? ele.forEach(recurseElements) : '';

    return result;
  };

  const handleDescendingSort = () => {
    let currentData = [...initialFormRow];
    currentData.sort(function (a, b) {
      if (a[selectedKey] > b[selectedKey]) {
        return -1;
      }
      if (a[selectedKey] < b[selectedKey]) {
        return 1;
      }
      return 0;
    });
    // setSortedData(currentData);
    setinitialFormRow(currentData);
  };

  const handleAscendingSort = () => {
    let currentData = [...initialFormRow];

    currentData.sort(function (a, b) {
      if (a[selectedKey] < b[selectedKey]) {
        return -1;
      }
      if (a[selectedKey] > b[selectedKey]) {
        return 1;
      }
      return 0;
    });

    setinitialFormRow(currentData);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <HeaderTestMode />
      <SearchBar
        theme={themeState}
        onPress={() => toggleOverlay()}
        value={search}
        keyboardType="default"
        setSearch={setSearch}
      />
      {initialFormRow?.length > 0 ? (
        <CustomTable
          theme={themeState}
          formColumnsName={initialFormColumns}
          formRowRecord={search.length > 0 ? searchData : initialFormRow}
          navigation={props.navigation}
          form={props.route.params.form}
        />
      ) : (
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.textItemLight
              : styles.textItem
          }>
          There are no records.
        </Text>
      )}
      <SortingList
        theme={themeState}
        toggleOverlay={toggleOverlay}
        visible={visible}
        item={initialFormRow}
        sort={sort}
        setSort={setSort}
        initialFormColumns={initialFormColumns}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        handleAscendingSort={handleAscendingSort}
        handleDescendingSort={handleDescendingSort}
      />
    </SafeAreaView>
  );
}
