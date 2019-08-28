import React, { Component } from 'react';
import {createDrawerNavigator, createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import Home from './home';
import messageCreater from './messageCreater';
import MessageRecepients from './messageRecepients';
import batchListAttendance from './batchListAttendance';
import takeAttendance from './takeAttendance';
import attendanceReportSelector from './attendanceReportSelector';
import chatScreen from './chatScreen';
import attendanceReport from './attendanceReport';
import studentDetails from './studentDetails';
import admin from './admin';
import manageBatch from './manageBatch';
import addBatch from './addBatch';
import authCheck from './authCheck';
import Login from './Login';
import newChat from './newChat';
import addStudent from './addStudent';
import editStudentData from './editStudentData';
import CustomTabBar from './customBarBottom';
import studentAdmin from './studentAdmin';
import batchAdmin from './batchAdmin';
import topic from './testTopic';
import newTestTopic from './newTestTopic';
import announcement from './announcement';
import createTest from './createTest';
import sendTest from './sendTest';
import testList from './testList';
import testQuestions from './testQuestions';
import testPerformance from './testPerformance';
import SideMenu from './SideMenu';
import selectUser from './selectUser';
import testListBatchwise from './testListBatchwise';
import {View, Text, Image, Dimensions, TouchableNativeFeedback } from 'react-native';
import { Icon } from "native-base";


const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;

export const messageStack = createStackNavigator({
  "New Channel": { screen: newChat},
  MessageRecepients: {screen: MessageRecepients},
  chatScreen: {screen: chatScreen}
}, {
  initialRouteName: 'MessageRecepients',
})

export const adminTopNavigator = createBottomTabNavigator({
  studentAdmin: { screen: studentAdmin, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh, justifyContent: 'center', alignItems: 'center', elevation: 3}}>
         <Icon type="FontAwesome" name={"user"} style={{ fontSize: 15, alignSelf: 'center', color: tintColor}} />
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Manage Students</Text>
      </View>
      )
  } },
  batchAdmin: { screen: batchAdmin, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center'}}>
         <Icon type="FontAwesome" name={"university"} style={{ fontSize: 15, alignSelf: 'center', color: tintColor}}/>
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Manage Batches</Text>
      </View>
      )
  } },
  
}, {
  tabBarComponent: props => (
  <CustomTabBar
      {...props}/> ),
  tabBarOptions: {
    activeTintColor: "#f32a76",
    inactiveTintColor: "#c1c8db",
    style: {
    backgroundColor: '#222126',
  },
  },
  lazy: true,
  initialRouteName: 'studentAdmin',
  navigationOptions: {
        header: null,
    }
})


export const adminStack = createStackNavigator({
  adminHome: { screen: adminTopNavigator},
  addStudent: { screen: addStudent },
  editStudentData: { screen: editStudentData },
  manageBatch: {screen: manageBatch},
  addBatch: {screen: addBatch}
}, {
  initialRouteName: 'adminHome',
})

export const newAttendanceStack = createStackNavigator({
  takeAttendance: { screen: takeAttendance},
  studentDetails: { screen: studentDetails }
}, {
  initialRouteName: 'takeAttendance',
  headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
          header: null
      }
})

export const attendanceReportsStack = createStackNavigator({
  Report: { screen: attendanceReport},
  studentDetails: { screen: studentDetails }
}, {
  initialRouteName: 'Report',
  headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
          header: null
      }
})


export const attendanceStack = createBottomTabNavigator({
  "New Attendance": { screen: batchListAttendance, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh, justifyContent: 'center', alignItems: 'center', elevation: 3}}>
         <Icon type="FontAwesome" name={"user-plus"} style={{ fontSize: 15, alignSelf: 'center', color: tintColor}} />
        
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>New Attendance</Text>
      </View>
      )
  } },
  "Attendance Report": { screen: attendanceReportSelector, navigationOptions: {
    tabBarIcon: ({ tintColor }) => (
      <View Style={{height: 5 * vh, width: 5 * vh,  justifyContent: 'center', alignItems: 'center'}}>
         <Icon type="FontAwesome" name={"bar-chart"} style={{ fontSize: 15, alignSelf: 'center', color: tintColor}}/>
        <Text style={{fontSize: 2.8 * vw, fontFamily: 'Montserrat-Bold', color: tintColor,}}>Attendance Report</Text>
      </View>
      )
  } },
  
}, {
  tabBarComponent: props => (
  <CustomTabBar
      {...props}/> ),
  tabBarOptions: {
    activeTintColor: "#f32a76",
    inactiveTintColor: "#c1c8db",
    style: {
    backgroundColor: '#222126',
  },
  },
  lazy: true,
  initialRouteName: 'New Attendance',
  navigationOptions: {
        header: null,
    }
})

export const HomeStack = createDrawerNavigator({
    Home: { screen: Home },
    Message: { screen: messageStack},
    Attendance: {screen: attendanceStack},
    NewAttendance: {screen: newAttendanceStack},
    attendanceReport: { screen: attendanceReportsStack },
    Admin: {screen: adminStack},
    announcement: { screen: announcement },
    createTest: { screen: createTest },
    topic: { screen: newTestTopic },
    sendTest: { screen: sendTest },
    testListBatchwise: { screen: testListBatchwise },
    testList: { screen: testList },
    takeAttendanceShortcut: { screen: takeAttendance},
    testPerformance: { screen: testPerformance },
    renderQuestions: { screen: testQuestions },
  }, {
    initialRouteName: 'Home',
    headerMode: 'none',
    contentComponent: SideMenu,
    drawerWidth: 300,
      navigationOptions: {
          headerVisible: false,
          header: null
      }
  })

export const Authstack = createSwitchNavigator({
  Login: {screen: Login},
  authCheck: {screen: authCheck},
  selectUser: {screen: selectUser},
  HomeStack: {screen: HomeStack}
}, {
  lazy: true,
  initialRouteName: 'authCheck',
})

const AuthFlowContainer = createAppContainer(Authstack);
export default AuthFlowContainer;
