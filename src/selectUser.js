import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Spinner} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, Dimensions, StyleSheet, BackHandler} from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';
import firebase from 'react-native-firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height
const vh = SCREEN_HEIGHT/100;
const vw = SCREEN_WIDTH/100;

export default class selectUser extends Component {

static navigationOptions = ({ navigation }) => ({
    title: 'Select User',
    headerStyle: {
      backgroundColor: '#353666',
    },
    style: {
      backgroundColor: '#353666',
      height: 0.1 * SCREEN_HEIGHT
    },
    headerTintColor: '#fff'
  })

  constructor(props) {
      super(props);
      this.newSignin = this.newSignin.bind(this);
      this.state = {
      isReady: false,
      userList: []
    }
  }

  handleBackPress = () => {
    this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
    return true;
  };

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }


  newSignin = async (username, password) => {
    await firebase.auth().signOut();

    firebase
      .auth()
      .signInWithEmailAndPassword(username+'@gmail.com', password)
      .then(() => {
        let jwtToken = firebase.auth().onAuthStateChanged(user => {
            if (user) {
              user.getIdToken().then(idToken => {
                  axios.defaults.headers.common['Authorization'] = idToken;
              })
            }
          });
          this.props.navigation.navigate("HomeStack");
      })
      .catch(error => {
        console.log("error");
    })
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    
    if(this.props.navigation.state.params.path == 'login'){
      url = `https://classcast-198812.appspot.com/teachersapp/admin_login`
    }
    else{
      url = `https://classcast-198812.appspot.com/teachersapp/change_login`
    }

      axios.get(url)
          .then(response=>{
              this.setState({
                userList: response.data,
                isReady: true
              })
          })
          .catch(error=>{
              console.log('error');
          });
  }

  render() {
    return (
      <Container style={{backgroundColor:'#e2e2e2', flex: 1}}>
        <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.06 * SCREEN_WIDTH, paddingBottom: 0.01 * SCREEN_HEIGHT, paddingTop: 0.05 * SCREEN_HEIGHT, color: 'black', textAlign: 'center'}}>Select User</Text> 
        <View style={styles.userListContainer}>
        { !this.state.isReady &&
          <Spinner color='red' />
         }
        { this.state.isReady &&
          this.state.userList && this.state.userList.map((blocks, index)=>{
            return(
              <TouchableNativeFeedback
                onPress = {() => {
                  this.newSignin(blocks.username, blocks.password);
                  this.setState({isReady: false});
                }}
              >
               <View style={styles.teacherContainer}>
                  <View style={styles.teacherImageContainer}>
                    <Image
                      source={{uri: blocks.photo}}
                      style={styles.teacherImage}/>
                    </View>
                    <Text style={styles.teacherName}> {blocks.name} </Text>
                </View>
              </TouchableNativeFeedback>
            )
          })
        }
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 0
    },
  teacherContainer: {
    paddingLeft: 5 * vw,
    paddingRight: 5 * vw,
    zIndex: 1,
    alignItems:'center',
    alignSelf: 'center'
  },
  teacherImage: {
    height: 15 * vh,
    width: '95%',
    resizeMode:'contain',
  },
  teacherImageContainer: {
    height: 15 * vh,
    width: 15 * vh,
    borderRadius: 7.5 * vh,
    borderWidth: .4 * vh,
    marginTop: 1 * vh,
    alignItems:'center',
    justifyContent: 'center',
    borderColor: '#3b0da6'
  },
  addTeacher: {
    height: 10 * vh,
    resizeMode:'contain',
  },
  teacherName: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: 1.7 * vh,
    marginTop: 0.5 * vh,
    color: 'black',
  },
  userListContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 2 * vh, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 5 * vh
  },
})