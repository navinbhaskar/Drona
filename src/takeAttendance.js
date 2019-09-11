import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon , ListItem, Spinner, DatePicker} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, Dimensions, ToastAndroid, BackHandler } from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';
const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100;


export default class takeAttendance extends Component {

static navigationOptions = {
  header: null,
};
constructor(props) {
    super(props);
    this._renderList = this._renderList.bind(this);
    this.loadData = this.loadData.bind(this);
    //this.submit = this.submit.bind(this);
    this.state = {
    isReady: false,
    today:  new Date(),
    studentList: [],
    Date: new Date()
    }
  }

  loadData() {
    axios.post(`https://classcast-198812.appspot.com/teachersapp/get_attendance_data_updated`, {
      "batch_id": this.props.navigation.state.params.batch_id,
      "standard": this.props.navigation.state.params.standard,
      "date": this.state.Date.getFullYear()+'-'+(this.state.Date.getMonth()+1)+'-'+this.state.Date.getDate()
    })
      .then(function (response){
        console.log("vjvvkvkv: "+JSON.stringify(response));
          //console.log("sknfsf"+JSON.stringify(response.data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))));
          response.data.attendance_data.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
          this.setState({studentList: response.data.attendance_data});
          this.setState({isReady: true});
      }.bind(this))
      .catch(function (error) {
          console.log('error');
      });
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };


  componentWillUnmount() {
    this.backHandler.remove();
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({studentList: []});
      this.loadData();
    })
  }

  submit() {
    console.log("studentList: "+JSON.stringify(this.state.studentList));
     var data = {
                  "batch_id": this.props.navigation.state.params.batch_id,
                  "standard": this.props.navigation.state.params.standard,
                  "students": this.state.studentList,
                  "date": this.state.Date.getFullYear()+'-'+(this.state.Date.getMonth()+1)+'-'+this.state.Date.getDate()
                }

    axios.post(`https://classcast-198812.appspot.com/teachersapp/submit_attendance`, data)
        .then(function (response){
            console.log("Post_request"+JSON.stringify(response.data));
            axios.post(`https://classcast-198812.appspot.com/teachersapp/send_attendance_notificaton`, {class_attended:  this.state.studentList});
            ToastAndroid.showWithGravity("Attendance marked successfully!", ToastAndroid.SHORT, ToastAndroid.CENTER)
            //this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
            this.props.navigation.goBack(null);
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });
  }

  _renderList({item, index}){
    return (
        <ListItem selected= {this.state.studentList[index].class_attended} style={{flexDirection:'row', width: '100%', flex:10}}
            onPress={() => {
                let studentList = this.state.studentList;
                studentList[index].class_attended= !item.class_attended;
                this.setState({studentList});
                console.log(JSON.stringify(this.state.studentList));
        }}>
                <Text style={{fontFamily: 'Montserrat-regular', fontSize: 4 * vw, flex:6}}>{item.name}</Text>
                <Icon type="FontAwesome" name={this.state.studentList[index].class_attended? "toggle-on": "toggle-off"}  active={false} style={{color: this.state.studentList[index].class_attended? "#04981d": "#de2517", fontSize: 8 * vw, alignSelf:'flex-end', flex:2}} />
                <Text style={{flex:2, fontFamily: 'Montserrat-Bold', fontSize: 3 * vw}}>{this.state.studentList[index].class_attended? "Present": "Absent"}</Text>
        </ListItem>
    );
}

  render() {
    console.log("dsajndasjlnasl: "+JSON.stringify(this.props.navigation.state.params));
    return (
      <Container style={{backgroundColor:'white', flex: 1}}>
      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 6 * vw, paddingBottom: 1 * vh, paddingTop: 5 * vh, color: 'black', textAlign: 'center'}}>Take Attendance</Text>
      <View style={{ width: '100%', height: 10 * vh, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

        <View style={{backgroundColor:"white", alignSelf: 'center', elevation: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5 * vw, padding: 2}}>
          <Image
            source={{uri: 'data:image/png;base64,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'}}
            style={{height: 5 * vw, width: 5 * vw, marginLeft: 5 * vw, opacity: 0.5}}
            />
          <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, color: 'black', paddingLeft: 5 * vw, paddingTop: 2 * vh, paddingBottom: 2 * vh}}>{'Date: '}</Text>
          <DatePicker
          defaultDate={new Date()}
          maximumDate={new Date()}
          locale={"en"}
          animationType={"fade"}
          androidMode={"calendar"}
          placeHolderText="Today"
          textStyle={{ fontFamily: 'Montserrat-Bold', fontSize: 6 * vw, color: "black" }}
          placeHolderTextStyle={{ fontFamily: 'Montserrat-Bold', fontSize: 6 * vw, color: "black" }}
          onDateChange={(date) => {
              this.setState({Date: date});
              this.loadData(),
              this.setState({ isReady: false })
          }}
          disabled={false}
          />
          <Icon type="FontAwesome" name={"chevron-down"}  active={false} style={{color: "black", fontSize: 4 * vw, alignSelf:'flex-end', alignSelf: 'center', paddingRight: 4 * vw}} />
        </View>
      </View>
        <Content style={{padding:5}}>
          { this.state.isReady &&
            <FlatList
                data={this.state.studentList}
                extraData={this.state}
                renderItem={this._renderList}
                />
          }
          { !this.state.isReady &&
            <Spinner color='red' />
          }
        </Content>
        <View style={{marginTop: 10}}>
          <Button block onPress={()=>{
            console.log('working');
            this.submit();
          }}>
            <Text>SUBMIT</Text>
          </Button>
        </View>
      </Container>
    );
  }
}
