import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, ListItem } from 'native-base';
import {View, Image, Dimensions, StyleSheet, ScrollView, FlatList, BackHandler } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const screen = Dimensions.get('window'),
 SCREEN_HEIGHT = screen.height,
 SCREEN_WIDTH = screen.width,
 vh = screen.height / 100,
 vw = screen.width / 100;


const USER_DP_MALE = require('./images/user-hp.png');
const USER_DP_FEMALE = require('./images/user-student.png');

export default class studentDetails extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
    super(props);
    this._renderList = this._renderList.bind(this);
    this.state = {
      name: null,
      gender: '',
      standard: null,
      phone: '',
      attendance_data: [],
      photo: '',
      teacher_id: 0,
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


  _renderList({item, index}){
        console.log("item: "+JSON.stringify(item))
        return (
            
            <View style={{flexDirection:'row', width: '90%', flex:18, marginTop: 1 * vh, alignSelf: 'center', marginBottom: 1 * vh, padding: 2 * vw, justifyContent:'center'}} >
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, flex:10}}>{item.fields.timestamp}</Text>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, flex: 8, color: item.fields.class_attended ? 'green': 'red',}}>{item.fields.class_attended? 'Present': 'Absent'}</Text>
                <Icon type="FontAwesome5" name= {item.fields.class_attended ? 'check': 'times'} style={{fontSize:2*vh, color: item.fields.class_attended ? 'green': 'red'}}/>
            </View>

        );
    }


   componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    
    axios.get(`https://classcast-198812.appspot.com/teachersapp/student_attendance_data/`+this.props.navigation.state.params.username+'/'+this.props.navigation.state.params.standard+'/'+this.props.navigation.state.params.batch_id)
        .then(function (response){
            console.log("sanisnsao"+JSON.stringify(response.data));
            this.setState({name: response.data.name});
            if(response.data.gender == 'Female') {
                this.setState({gender: 'F'})
              }
            if(response.data.gender == 'Male') {
                this.setState({gender: 'M'})
              }
            this.setState({standard: response.data.standard});
            this.setState({photo: response.data.photo});
            this.setState({phone: response.data.phone});
            this.setState({attendance_data: response.data.attendance_data});
            this.setState({isReady: true});
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });
   }

    render() {
        console.log(JSON.stringify(this.props.navigation.state.params))
    return (
      <View style={styles.container}>
        <ScrollView>
        { this.state.isReady &&
            <View style={styles.aboutUserSection}>
              <Image 
                source={ this.state.gender == 'M' ? USER_DP_MALE: USER_DP_FEMALE}
                style={styles.userImage}/>
            
              <View style={{flexDirection: 'row', padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Name:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.state.name}</Text>
              </View>
              <View style={{flexDirection: 'row',padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, textAlign: 'left', marginLeft: 5 * vw}}>Class:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.state.standard}</Text>
              </View>
              <View style={{flexDirection: 'row', padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Gender:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.state.gender == 'M'? 'Male': 'Female'}</Text>
              </View>
              <View style={{flexDirection: 'row',padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Phone Number:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>+91 {this.state.phone}</Text>
              </View>
            </View>
        
      }
        <View style={{borderRadius: 1.5 * vh, width: '100%', padding : 2* vh, backgroundColor:"white", marginTop: 3* vh, marginBottom: 5*vh}}>
            <ListItem style={{flexDirection:'row', width: '90%', marginBottom: 0.01 * SCREEN_HEIGHT, alignSelf: 'center'}} >
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH, flex:10}}>Date</Text>
                <View style={{flex: 6}}>
                    <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH}}>Attendance</Text>  
                </View>
            </ListItem>
            <FlatList 
                data={this.state.attendance_data}
                renderItem={this._renderList}
                />   
        </View>         
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   padding: 2.5 * vh,
   flex: 1,
   backgroundColor: '#D8EBED'
 },
 userImage: {
   height: 15*vh,
   width: 15*vh,
   alignSelf: 'center',
   marginBottom: 2* vh,
 },
 aboutUserSection:{
   marginTop: 2 * vh,
   width: '100%',
   borderRadius: 1.5 *vw,
   backgroundColor: 'white',
   padding: 2.5 *vh
 },
})