import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions, StackActions} from 'react-navigation';
import {Icon} from 'native-base';
import {ScrollView, Text, View, Image, TouchableOpacity, Linking, TouchableNativeFeedback, BackAndroid, BackHandler} from 'react-native';
import firebase from 'react-native-firebase';
import axios from "axios/index";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';


class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  constructor(props) {
    super(props);
    this.signOutUser = this.signOutUser.bind(this);
    this.state = {
      teacher_id: null,
      name: null,
      student_count: 0,
      course_count: 0,
      photo: ''
    }
  }

  handleBackPress = () => {
    this.props.navigation.closeDrawer();
    return true;
  };

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    await firebase.auth().onIdTokenChanged( (user) => {
        console.log("dsnlfDMKF:");
        if(user) {
          console.log("dsnlfDMKFuser: "+JSON.stringify(user));
          console.log("dsnlfDMKFuser: "+user.email.split('@')[0]);
          this.setState({username: user.email.split('@')[0] });
          let jwtToken = firebase.auth().onAuthStateChanged(user => {
            if (user) {
              user.getIdToken().then(idToken => {
                  console.log("dsnlfDMKFtoken: "+idToken);
                  axios.defaults.headers.common['Authorization'] = idToken;
                  axios.get(`https://classcast-198812.appspot.com/teachersapp/teacher_data`)
                    .then(function (response){
                        console.log(JSON.stringify(response.data.teacher_id));
                        this.setState({teacher_id: response.data.teacher_id});
                        this.setState({name: response.data.name});
                        this.setState({student_count: response.data.student_count});
                        this.setState({course_count: response.data.courses});
                        this.setState({photo: response.data.photo});
                    }.bind(this))
                    .catch(function (error) {
                        console.log("nsajaskf"+error);
                    });
              })
            }
          })
        }
      });
  }

  signOutUser = async () => {
    console.log("working");
    try {
        this.props.navigation.closeDrawer();
        //this.props.navigation.dispatch(StackActions.popToTop());
        this.props.navigation.navigate('Authstack', {}, NavigationActions.navigate({ routeName: 'authCheck' }));
        await firebase.auth().signOut();
        BackHandler.exitApp();
    } catch (e) {
        console.log("asgisaais"+e);
    }
  }

  render () {
    return (
      <View style={styles.container}>
        
        <ScrollView>
          <View style={styles.aboutUserSection}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.userImageContainer}>
                <Image 
                  source={{uri: this.state.photo}}
                  style={styles.userImage}/>
              </View>
            </View>
            <View>
              <Text style={styles.userName}>
                {this.state.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Icon type="FontAwesome" name="users" style={{ fontSize: 5 * vw, color:'#211482', margin: 5 }} />
                <Text style={styles.class}>{this.state.student_count+ ` Students`}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon type="FontAwesome" name="play" style={{ fontSize: 5 * vw, color:'#211482', margin: 5 }} />
                <Text style={styles.class}>{this.state.course_count+` Courses`}</Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 2 * vh}}>
            
              <Text style={styles.navItemStyle} onPress={()=>{
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
              }}>
                Home
              </Text>

              <Text style={styles.navItemStyle} onPress={() => {
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate("selectUser", {path: 'home'});
              }}>
                Change User
              </Text>

              <Text style={styles.navItemStyle} onPress={() => {
                const navigateAction = NavigationActions.navigate({
                      routeName: 'Attendance'
                    });
                    this.props.navigation.dispatch(navigateAction); 
              }}>
                Take Attendance
              </Text>
            </View>
          
          
          <View>
              <Text style={styles.navItemStyle} onPress={() => {
                this.props.navigation.navigate('Message')
              }}>
                Chat
              </Text>
              
              
              <Text style={styles.navItemStyle} onPress={() => {
                const navigateAction = NavigationActions.navigate({
                      routeName: 'Admin'
                    });
                    this.props.navigation.dispatch(navigateAction); 
              }}>
                Manage
              </Text>
            
            </View>
          <View>
            
              <Text style={styles.navItemStyle} onPress={()=> {
                Linking.openURL('whatsapp://send?text=Hello%20Deepak%2C%20I%27m%20'+ this.state.name+ '&phone=919555579357')
              }}>
                Talk to Us
              </Text>
              
              <Text style={styles.navItemStyle} onPress={()=> {
                this.signOutUser()
              }}>
                Signout and Exit
              </Text>
              
            </View>

        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={{color: 'white', fontSize: 1 * vh, textAlign: 'right'}}>Built with love by team ClassCast  </Text>
        </View>

      </View>
    );
  }
}



export default SideMenu;