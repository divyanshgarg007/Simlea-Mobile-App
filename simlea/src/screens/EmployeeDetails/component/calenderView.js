/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
} from 'react-native';
import {
  CustomTextInput,
  CustomButton,
  CustomTextBox,
} from '../../../components';
import {IconButton, Button, Avatar} from 'react-native-paper';
import {Calendar} from 'react-native-big-calendar';
// import dayjs from 'dayjs';
import moment from 'moment';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector} from 'react-redux';
import {tr} from 'date-fns/locale';

export default function CalenderView(props) {
  const employeeState = useSelector(state => state.rootReducers?.employeeState);
  const [visible, setVisible] = useState(false);
  const [visibleEmployeeModal, setVisibleEmployeeModal] = useState(false);
  const [calenderMode, setCalenderMode] = useState('month');
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [keyEmp, setKeyEmp] = useState('');
  const [date, setDate] = useState({});
  const [title, setTitle] = useState(['New Event']);
  const [desc, setDesc] = useState(['Description']);
  const [events, setEvents] = useState([
    {
      start: date,
      end: date,
      title: title,
      desc: desc,
    },
  ]);

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  const toggleModal = date => {
    setVisible(!visible), setDate(date);
  };

  const EmployeeNameToggle = () => {
    setVisibleEmployeeModal(!visibleEmployeeModal);
    setVisible(false);
  };

  const addEvent = useCallback(
    (title, desc, date) => {
      const start = date;
      const end = date;
      title = title;
      desc = desc;
      setEvents([...events, {start, end, title, desc}]);
      setTitle('');
      setDesc('');
    },

    [events, setEvents],
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}>
        <View
          style={
            themeState?.activeTheme === 'light'
              ? styles.containerStyleLight
              : styles.containerStyle
          }>
          <View style={styles.modalContainer}>
            <View style={styles.eventImageBox}>
              <Image
                source={require('../../../assets/images/events.png')}
                style={styles.eventImage}
              />
            </View>
            <Text style={styles.addEventTitleText}>Create Events</Text>
            <View style={styles.dateBox}>
              <Text style={styles.addEventText}>
                {moment.utc().local().format('YYYY-MM-DD HH:mm')}
              </Text>
              <Text style={styles.addEventText}>
                {moment
                  .utc()
                  .local()
                  .add(0.5, 'hours')
                  .format('YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <CustomTextBox
              style={styles.inputStyle}
              placeholder="Enter Event Title"
              keyboardType="default"
              name="title"
              value={title}
              placeholderTextColor="#1a1a1a"
              onChangeText={title => setTitle(title)}
            />
            <CustomTextBox
              style={styles.inputStyle}
              placeholder="Enter Description"
              keyboardType="default"
              name="desc"
              value={desc}
              placeholderTextColor="#1a1a1a"
              onChangeText={desc => setDesc(desc)}
            />
            <View style={styles.spaceBtnsOnDropdown}>
              <TouchableOpacity
                style={styles.dropdownButtonDark}
                onPress={() => EmployeeNameToggle()}>
                <Text style={styles.dropdownButtonTextDark}>
                  {' Employees  '}
                  {selectedEmp + ' '}
                </Text>
                <Image
                  style={styles.arrow}
                  source={require('../../../assets/images/dropIconDark.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.spaceBtnsOnDropdown}>
              <TouchableOpacity style={styles.dropdownButtonDark}>
                <Text>Resource </Text>
                <Image
                  style={styles.arrow}
                  source={require('../../../assets/images/dropIconDark.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.addEventBtn}>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.cancelBtn}
                  icon={require('../../../assets/images/cancel.png')}
                  labelStyle={styles.actionTitle}
                  title="Cancel"
                  onPress={() => toggleModal()}
                />
              </View>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.confirmBtn}
                  icon={require('../../../assets/images/tick.png')}
                  labelStyle={styles.actionTitle}
                  title="Confirm"
                  onPress={() => [addEvent(title, desc, date), toggleModal()]}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleEmployeeModal}
        onRequestClose={() => {
          setVisibleEmployeeModal(false);
        }}>
        <View style={styles.containerStyle}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.dropdownModal}>
              <View style={styles.addEmployeeBtn}>
                {employeeState?.employeeList?.data?.list.map((empee, ind) => (
                  <TouchableOpacity
                    style={styles.addEmployeeBtnn}
                    onPress={() => {
                      setVisible(true),
                        setVisibleEmployeeModal(false),
                        setSelectedEmp([empee.firstName, empee.lastName]),
                        setKeyEmp(ind);
                    }}
                    key={ind}>
                    <Text style={styles.dropdownButtonTextDark}>
                      {empee.firstName} {empee.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
                {keyEmp && (
                  <Image
                    source={require('../../../assets/images/tick.png')}
                    style={styles.arrow}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={[
          styles.container,
          props.theme.activeTheme === 'light'
            ? GlobalStyle.lightTheme
            : GlobalStyle.darkTheme,
        ]}>
        <View style={styles.monthBtn}>
          <View style={styles.monthSpaceBtns}>
            <CustomButton
              style={
                calenderMode === 'month' ? styles.confirmBtn : styles.cancelBtn
              }
              labelStyle={styles.actionTitle}
              title="Month"
              onPress={() => setCalenderMode('month')}
            />
          </View>
          <View style={styles.monthSpaceBtns}>
            <CustomButton
              style={
                calenderMode === 'day' || calenderMode === 'week'
                  ? styles.confirmBtn
                  : styles.cancelBtn
              }
              labelStyle={styles.actionTitle}
              title="Day"
              onPress={() =>
                setCalenderMode(Platform.isPad === true ? 'week' : 'day')
              }
            />
          </View>
        </View>
        <Calendar
          events={events}
          height={Platform.isPad === true ? 700 : 500}
          mode={calenderMode}
          // onChangeDate={([start: Date, end: Date]) => moment().toDate()}
          onPressCell={(date: Date) => toggleModal(date)}
          eventCellStyle={styles.containerStyleEvent}
          onPressEvent={() => toggleModal()}
          showAdjacentMonths={false}
          dayHeaderHighlightColor="#30C6EA"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyleLight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(129,129,165,.3)',
  },
  containerStyleEvent: {
    alignItems: 'center',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 10,
    backgroundColor: '#30C6EA',
  },
  modalContainer: {
    width: Platform.isPad === true ? '85%' : '90%',
    backgroundColor: '#FBFBFB',
    borderRadius: Platform.isPad === true ? 10 : 6,
    paddingHorizontal: Platform.isPad === true ? 40 : 20,
    paddingVertical: Platform.isPad === true ? 46 : 25,
    position: 'relative',
    flexDirection: 'column',
  },

  container: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    marginTop: 15,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    padding: 2,
  },
  eventImageBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 5,
  },
  eventImage: {
    height: Platform.isPad === true ? 70 : 39,
    width: Platform.isPad === true ? 61 : 34,
    resizeMode: 'contain',
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay500,
    fontSize: Platform.isPad === true ? 16 : 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    color: '#1A1A1A',
  },
  addEventTitleText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 24 : 16,
    textAlign: 'center',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 15,
  },
  inputStyle: {
    height: 40,
    borderRadius: Platform.isPad === true ? 6 : 4,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 16 : 14,
  },
  monthBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    width: '100%',
  },
  monthSpaceBtns: {
    flex: 0,
    flexBasis: '45%',
  },
  addEventBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '40%',
  },
  cancelBtn: {
    backgroundColor: Platform.isPad === true ? '#4B4D54' : '#1A1A1A',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 47 : 35,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 47 : 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 10,
    lineHeight: Platform.OS === 'ios' ? 0 : 15,
  },
  spaceBtnsOnDropdown: {
    flex: 0,
    flexBasis: '5%',
  },
  dropdownButtonTextDark: {
    color: '#000',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'left',
  },
  addEmployeeBtn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropdownModal: {
    flexDirection: 'row',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#FBFBFB',
    width: '100%',
  },
  dropdownButtonDark: {
    backgroundColor: 'rgba(208, 211, 212,0.3 )',
    justifyContent: Platform.isPad === true ? 'center' : 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: Platform.isPad === true ? 30 : 26,
  },
  arrow: {
    height: 7,
    width: 10,
    resizeMode: 'contain',
    marginLeft: Platform.isPad === true ? 10 : 0,
  },
});
