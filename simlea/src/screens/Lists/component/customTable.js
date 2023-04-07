import React from 'react';
import { StyleSheet, ScrollView, Text, Platform } from 'react-native';
import { DataTable } from 'react-native-paper';
import GlobalStyle from '../../../style/globalstyle';
import { NAVIGATION } from '../../../constants/navigation';
import moment from 'moment';

export default function CustomTable(props) {
  return (
    <ScrollView>
      <ScrollView
        horizontal={true}
        style={[
          styles.listContainer,
          props?.theme?.activeTheme === 'light'
            ? GlobalStyle.lightTheme
            : GlobalStyle.darkTheme,
        ]}
        contentContainerStyle={styles.contentStyle}>
        <DataTable>
          <DataTable.Header
            style={[
              styles.tableHeader,
              props?.theme?.activeTheme === 'light'
                ? GlobalStyle.lightTheme
                : GlobalStyle.darkTheme,
            ]}>
            {props?.formColumnsName.map((row, index) => (
              <DataTable.Title
                textStyle={[
                  styles.textItem,
                  props.theme.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}
                style={styles.titleCellBox}
                key={index}>
                {row}
              </DataTable.Title>
            ))}
          </DataTable.Header>
          <>
            {props?.formRowRecord?.map((row, index) => (
              <DataTable.Row
                style={[
                  styles.rowHeader,
                  props.theme.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}
                key={index}
                // onPress={() => props.onPress(row)}
                onPress={() =>
                  props.navigation.navigate(NAVIGATION.editForm, {
                    data: props.form,
                    item: row,
                  })
                }>
                {props?.formColumnsName.map((row2, index1) => (
                  <DataTable.Cell
                    textStyle={[
                      styles.textItem,
                      props.theme.activeTheme === 'light'
                        ? GlobalStyle.lightTheme
                        : GlobalStyle.darkTheme,
                    ]}
                    style={styles.dataCellBox}
                    key={index1}>
                    {row[row2]}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </>
        </DataTable>
      </ScrollView>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  listContainer: {
    marginTop: Platform.isPad === true ? 33 : 13,
    // borderColor: '#808191',
    marginLeft: 5,
    marginRight: 15,
  },
  contentStyle: {
    maxWidth: '140%',
    // flexWrap: 'wrap',
  },
  tableHeader: {
    borderColor: '#808191',
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#262626',
    justifyContent: 'center',
  },
  rowHeader: {
    borderColor: '#808191',
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1,
    borderBottomColor: '#808191',
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#262626',
    height: '2%',
  },
  titleCellBox: {
    borderLeftWidth: 1,
    borderColor: '#808191',
    justifyContent: 'center',
  },
  dataCellBox: {
    borderLeftWidth: 1,
    borderColor: '#808191',
    justifyContent: 'center',
  },

  textTitle: {
    textAlign: 'center',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 12,
    color: '#EAEAEA',
  },
  textItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 10,
    color: '#EAEAEA',
  },
});
