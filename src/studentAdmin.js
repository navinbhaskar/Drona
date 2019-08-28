import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Spinner} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, Dimensions, BackHandler } from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class studentAdmin extends Component {

static navigationOptions = ({ navigation }) => ({
    title: 'Admin Actions',
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
      this._renderStudentList = this._renderStudentList.bind(this);
      this.state = {
      random: false,
      studentList: [],
      isReady: false
    }
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      axios.get(`https://classcast-198812.appspot.com/teachersapp/student_list_with_batch_id/`)
          .then(function (response){
              console.log("abcd: "+JSON.stringify(response.data));
              response.data.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
              this.setState({studentList: response.data});
              this.setState({isReady: true});
          }.bind(this))
          .catch(function (error) {
              console.log('error');
          });
      })
  }

_renderStudentList({item, index}){
    return (
      <View style={{flexDirection:'column', width: '95%', flex:21, padding:0.02 * SCREEN_HEIGHT, paddingLeft:0.005 * SCREEN_HEIGHT, backgroundColor: '#ffffff', marginBottom: 0.02 * SCREEN_HEIGHT, borderRadius: 0.01 * SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
        <TouchableNativeFeedback
          onPress={() => {
              this.props.navigation.navigate('editStudentData', {
                username: item.username
              })}}>
          <View style={{flexDirection: 'row'}}>

            <View style={{flex: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
              <View style={{flex: 5, justifyContent: 'center', alignSelf: 'center'}}>
                <View style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center', borderRadius: 0.08 * SCREEN_WIDTH, height: 0.16 * SCREEN_WIDTH, width: 0.16 * SCREEN_WIDTH}}>
                  <Image
                        source= {{uri: 'data:image/png;base64,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'}}
                        style={{
                          width: 0.05 * SCREEN_HEIGHT,
                          height: 0.05 * SCREEN_HEIGHT,
                        }}
                      />
                </View>
              </View>


            </View>
            <View style={{flex:10, justifyContent:'flex-start', alignSelf: 'center'}}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH, alignSelf:'flex-start'}} >{item.name}</Text>
                <View style={{flexDirection:'row'}}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.03 * SCREEN_WIDTH,alignSelf:'flex-start', color:'#f32a76'}}>{item.batch_id}</Text>
                    <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.03 * SCREEN_WIDTH,alignSelf:'flex-start', color:'#f32a76', marginLeft: 0.02 * SCREEN_WIDTH}}>Class {item.standard}</Text>
                </View>
            </View>
            <View style={{alignSelf: 'center'}}>
                <Icon type="FontAwesome5" name="chevron-right" style={{fontSize: 0.05 * SCREEN_WIDTH}}/>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>

    );
}

  render() {
    return (
      <Container style={{backgroundColor:'#D8EBED', flex: 1}}>
      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.06 * SCREEN_WIDTH, paddingBottom: 0.01 * SCREEN_HEIGHT, paddingTop: 0.05 * SCREEN_HEIGHT, color: 'black', textAlign: 'center'}}>Manage Students</Text> 
        <Content style={{padding:5}}>         
          <TouchableNativeFeedback
              onPress={() => {
                this.props.navigation.navigate('addStudent');
            }}>
            <View style={{flexDirection:'column', width: '95%', flex: 10, padding:0.03 * SCREEN_HEIGHT, backgroundColor: '#f32a76', marginBottom: 0.02 * SCREEN_HEIGHT, borderRadius: 0.01 * SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon type="FontAwesome" name="plus" active={false} style={{fontSize: 0.05 * SCREEN_WIDTH, color: 'white', alignSelf:'center', marginLeft:0.05* SCREEN_WIDTH, flex:2}} /> 
                <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.04 * SCREEN_WIDTH, flex:8, color: 'white', alignSelf: 'center'}} >Add New Student</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
            { this.state.isReady &&
              <FlatList 
                  data={this.state.studentList}
                  extraData={this.state}
                  renderItem={this._renderStudentList}
                  />
            }
            { !this.state.isReady &&
              <Spinner color='red' />
            }      
        </Content>            
      </Container>
    );
  }
}