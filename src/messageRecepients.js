import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Fab, Spinner } from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, Dimensions, BackHandler } from 'react-native';
import firebase from 'react-native-firebase';
import axios from 'axios';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const vh = SCREEN_HEIGHT/100;
const vw = SCREEN_WIDTH/100;

export default class messageRecepients extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this._renderList = this._renderList.bind(this);
    this.timeSince = this.timeSince.bind(this);
    this.state = {
    active: false,
    random: false,
    isReady: false,
    recepients: [],
    username: null
    }
  } 

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  timeSince(date) {
    var hour = date.split(' ')[1].split(':')[0];
    var minute = date.split(' ')[1].split(':')[1];
    var second = date.split(' ')[1].split(':')[2];
    var year = date.split(' ')[0].split('-')[0];
    var month = date.split(' ')[0].split('-')[1];
    var day = date.split(' ')[0].split('-')[2];
    console.log("fnsdnls: "+new Date(year, month, day, hour, minute));
    console.log("fnsdnlstoday: "+new Date());
    var new_format_date = new Date(year, month, day, hour, minute);
    //var dif =  new Date() - new_format_date;
    var dif = ((new Date()).getTime() - new_format_date.getTime()) + 2678200000;
    console.log("fnsdnls: "+dif);
    var seconds = Math.floor(parseFloat(dif / 1000)) - 19570;
    var interval = Math.floor(parseFloat(seconds / 31536000));
    if (seconds < 10){
      return "a few seconds";
    }
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(parseFloat(seconds / 2592000));
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(parseFloat(seconds / 86400));
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(parseFloat(seconds / 3600));
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(parseFloat(seconds / 60));
    if (interval > 1) {
        return interval + " minutes";
    }
    //ToastAndroid.show("auaaaa" + Math.floor(parseFloat(seconds))+ new Date() + typeof(Math.floor(parseFloat(seconds))) + typeof(seconds) + typeof(interval), ToastAndroid.SHORT);
    return Math.floor(parseFloat(seconds)) + " seconds";
  }

  loadData() {
    axios.get(`https://classcast-198812.appspot.com/teachersapp/chat_list/`)
    .then((res)=> {
      console.log("chat_list: "+JSON.stringify(res.data));
      this.setState({recepients: res.data.reverse(),
                        isReady: true
           })
    })
    .catch(err=> {console.log("errorrr: "+err)})

    axios.get(`https://classcast-198812.appspot.com/teachersapp/updateMessageSeenStatus`)
    
  }


_renderList({item, index}){
    console.log("data1234: "+JSON.stringify(item));
    return (
      <TouchableNativeFeedback onPress={() => {
                    this.props.navigation.navigate('chatScreen', {
                      name: item.name,
                      username: item.username,
                      chat_id: item.chat_id
                    });
            }}>
        <View style={{flexDirection:'row', width: '100%', flex:21, padding: 2* vh, alignItems:'center', borderBottomColor:'#ffffff', borderBottomWidth: 0.1 *vh}}>
          
            <View style={{flex: 4, justifyContent: 'center'}}>
              <View style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center', borderRadius: 0.07 * SCREEN_WIDTH, height: 0.14 * SCREEN_WIDTH, width: 0.14 * SCREEN_WIDTH}}>
                <Image
                        source= {{uri: item.type == 'group' ? 'data:image/png;base64,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'
                                                            : 'data:image/png;base64,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'
                                }}
                        style={{
                          width: 0.05 * SCREEN_HEIGHT,
                          height: 0.05 * SCREEN_HEIGHT,
                        }}
                      />
              </View>
            </View>
            <View style={{flex:10, justifyContent:'flex-start'}}>
                <Text style={{fontFamily: item.type == 'student' ? 'Montserrat-SemiBold': 'Montserrat-Bold', fontSize: 0.04 * SCREEN_WIDTH, alignSelf:'flex-start'}} >{item.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#f32a76'}}>{ item.type=="student"? item.batch_id: '' }</Text>
                    <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#f32a76', marginLeft:5}}>Class {item.standard}</Text>
                </View>                
            </View>
            <View>
                    <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.025 * SCREEN_WIDTH, color:'#f32a76'}}>{this.timeSince(item.timestamp)} ago</Text>
            </View>
            
          
        </View>
        
      </TouchableNativeFeedback>


    );
}

  async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    var currentUser = await firebase.auth().currentUser;                 
     await currentUser.getIdToken()
            .then(idToken => {
                  console.log("sanusa: "+JSON.stringify(currentUser['email'].split('@')[0]))
                  //this.setState({ username: currentUser['email'].split('@')[0] });
                });

    this.loadData();

    /*
    const db = firebase.firestore()
        db.collection('chatLists')
          .doc(this.state.username)
            .onSnapshot((doc)=> {
              if (doc.exists) {
                this.loadData()
              }
            }),
            (error) => {
            console.error(error);
            };
    */

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })

  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#D8EBED'}}>
        <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.06 * SCREEN_WIDTH, paddingBottom: 0.01 * SCREEN_HEIGHT, paddingTop: 0.05 * SCREEN_HEIGHT, color: 'black', textAlign: 'center'}}>Conversations</Text> 
        <Content style={{padding:1* vw}}>
        { this.state.isReady &&
            <FlatList 
                data={this.state.recepients}
                extraData={this.state}
                renderItem={this._renderList}
                />  
         }
         { !this.state.isReady &&
          <Spinner color='red' />
         }    
        </Content>
        <View style={{ position: 'absolute', bottom: 0, right: 0}}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => {this.props.navigation.navigate('New Channel')}}>
            <Icon name="add" />
          </Fab>
        </View>            
      </Container>
    );
  }
}