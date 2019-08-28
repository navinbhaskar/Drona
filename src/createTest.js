import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Input} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, ScrollView, StyleSheet, Dimensions, LayoutAnimation, TextInput, Picker, ToastAndroid, BackHandler, TimePickerAndroid, DatePickerAndroid, alert } from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const USER_STUDENT = require('./images/user-student.png');
const USER_HP = require('./images/user-hp.png');


export default class createTest extends Component {

  static navigationOptions = {
      header: null,
      };
  constructor(props) {
      super(props);
      this.selectTime = this.selectTime.bind(this);
      this.selectDate = this.selectDate.bind(this);
      this.submitData = this.submitData.bind(this);
      this.renderItem = this.renderItem.bind(this);
      this.handleBackPress = this.handleBackPress.bind(this);
      this.state = {
        testData: [],
        selectedClassIndex: 0,
        selectedGoalIndex: 0,
        selectedSubjectIndex: 0,
        batchList: [],
        batch_id: '',
        batchSelected: false,
        isReady: false,
        message: '',
        hour: 0,
        minute: 0,
        year: 2019,
        month: 1,
        day: 1,
        dateSelected: false,
        timeSelected: false
      }
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  async selectDate() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
          year: year,
          month: month,
          day: day,
          dateSelected: true
        })
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }

  }

  async selectTime() {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: true, 
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        console.log("dsnidssddsa: "+action+"||"+hour+"||"+minute);
        this.setState({
          hour: hour,
          minute: minute,
          timeSelected: true
        })
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }

  }

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    axios.get(`https://classcast-198812.appspot.com/teachersapp/exams_list`)
        .then(function (response){
            console.log("abcd: "+JSON.stringify(response.data));
            this.setState({
              testData: response.data,
              isReady: true
            });
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });

    axios.get(`https://classcast-198812.appspot.com/teachersapp/batch_list_without_student_count/`)
        .then(function (response){
            console.log("abcdef: "+JSON.stringify(response.data));
            this.setState({batchList: response.data})
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });
  }

  submitData() {
    
    const navigateAction = NavigationActions.navigate({
                routeName: 'topic',
                params: {
                  class: this.state.testData[this.state.selectedClassIndex].standard,
                  goal: this.state.testData[this.state.selectedClassIndex].data[this.state.selectedGoalIndex].name,
                  subject: this.state.testData[this.state.selectedClassIndex].data[this.state.selectedGoalIndex].package[this.state.selectedSubjectIndex].name,
                  duration: 30,
                  batch_id: this.state.batch_id,
                  deadline: new Date(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute)
                }
              });
    this.props.navigation.dispatch(navigateAction);
  }


  renderItem = ({item}) => {
    console.log("itemdata: "+JSON.stringify(item));
    if(item.fields.standard == this.state.testData[this.state.selectedClassIndex].standard){
      return (
        <TouchableNativeFeedback
        onPress={()=> {
          this.setState({batch_id: item.fields.batch_id});
          this.setState({batchSelected: true});
        }}>
        <View style={[
          {height: 0.05 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderColor: 'black', opacity: 1, borderWidth: 0.003 * SCREEN_WIDTH, borderColor: 'black', margin: 0.01*SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', padding: 0.03 * SCREEN_WIDTH, paddingTop: 0.02 * SCREEN_WIDTH, paddingBottom: 0.02 * SCREEN_WIDTH},
          this.state.batch_id==item.fields.batch_id && { backgroundColor: 'rgba(164, 139, 206, 1)', opacity: 1},
        ]}>
            <Text style={[styles.classContainerText,{color: this.state.batch_id==item.fields.batch_id ? 'white': 'black'}]}>{item.fields.batch_id}</Text>
          </View>
        </TouchableNativeFeedback>
      )
    }
    else {
      return (
        <View>
        </View>
        )
    }
  }
  

  render() {

    const { selectedClassesIndex, selectedStreamIndex, name, gender, username, usernameValid, standard } = this.state
    console.log("gender: "+this.state.gender)
    return (
      <View style={{backgroundColor: '#D8EBED', height: '100%'}}>
        <ScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.06 * SCREEN_WIDTH, paddingBottom: 0.01 * SCREEN_HEIGHT, paddingTop: 0.05 * SCREEN_HEIGHT, color: 'black', textAlign: 'center'}}>Create Test</Text> 
          <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, color: 'black', marginTop: 0.05 * SCREEN_HEIGHT}]}>Select Class</Text>
          <View style = {{flexDirection: 'row', flexWrap: 'wrap'}}>
            {
              this.state.testData && this.state.testData.map((blocks, index)=>{        
                return(
                  <TouchableNativeFeedback
                    onPress={()=>this.setState({
                      selectedClassIndex: index,
                      batchSelected: false,
                      batch_id: ''
                    })}
                  >
                    <View style = {[styles.classContainer, {backgroundColor: this.state.selectedClassIndex==index ? 'rgba(164, 139, 206, 1)': '#F0F9FB'}]}>
                      <Text style={[styles.classContainerText,{color: this.state.selectedClassIndex==index ? 'white': 'black'}]}>{blocks.standard}</Text>      
                    </View>
                  </TouchableNativeFeedback>
                )
              })
            }
          </View>

          { this.state.isReady &&

            <View style={{width: '75%'}}>
            <Text style={[styles.classContainerText,{ alignSelf: 'center', color: 'black', marginTop: 0.02 * SCREEN_HEIGHT}]}>Select Batch</Text>
              <FlatList
                style={[styles.flatListContainer, {alignSelf: this.state.standard == 11? 'flex-start': this.state.standard == 13? 'flex-end': 'center'}]}
                data={this.state.batchList}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
              />
            </View>
          }

          <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, color: 'black', marginTop: 0.04 * SCREEN_HEIGHT}]}>Select Goal</Text>
          <View style = {{flexDirection: 'row', flexWrap: 'wrap'}}>
            { this.state.testData.length > 0 &&
              this.state.testData[this.state.selectedClassIndex].data && this.state.testData[this.state.selectedClassIndex].data.map((blocks, index)=>{        
                return(
                  <TouchableNativeFeedback
                    onPress={()=>this.setState({selectedGoalIndex: index})}
                  >
                    <View style = {[styles.classContainer, {backgroundColor: this.state.selectedGoalIndex==index ? 'rgba(164, 139, 206, 1)': '#F0F9FB'}]}>
                      <Text style={[styles.classContainerText,{color: this.state.selectedGoalIndex==index ? 'white': 'black'}]}>{blocks.name}</Text>      
                    </View>
                  </TouchableNativeFeedback>
                )
              })
            }
          </View>

          <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, color: 'black', marginTop: 0.04 * SCREEN_HEIGHT}]}>Select Subject</Text>
          <View style = {{flexDirection: 'row', flexWrap: 'wrap'}}>
            { this.state.testData.length > 0 &&
              this.state.testData[this.state.selectedClassIndex].data[this.state.selectedGoalIndex].package && this.state.testData[this.state.selectedClassIndex].data[this.state.selectedGoalIndex].package.map((blocks, index)=>{        
                return(
                  <TouchableNativeFeedback
                    onPress={()=>this.setState({selectedSubjectIndex: index})}
                  >
                    <View style = {[styles.classContainer, {backgroundColor: this.state.selectedSubjectIndex==index ? 'rgba(164, 139, 206, 1)': '#F0F9FB'}]}>
                      <Text style={[styles.classContainerText,{color: this.state.selectedSubjectIndex==index ? 'white': 'black'}]}>{blocks.name}</Text>      
                    </View>
                  </TouchableNativeFeedback>
                )
              })
            }
          </View>

            <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, marginTop: 0.04 * SCREEN_HEIGHT}]}>Select Timing</Text>
            <View style={{flexDirection: 'row', marginBottom: 0.2 * SCREEN_HEIGHT}}>
              <Button style={{ backgroundColor: '#A48BCE'}} onPress={() =>this.selectDate()} block >
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 0.03 * SCREEN_WIDTH, color: 'white'}}>{this.state.dateSelected ? this.state.day+'/'+this.state.month+'/'+this.state.year : 'Select Date'}</Text>
              </Button>
              <Text>  </Text>
              <Button style={{ backgroundColor: '#A48BCE'}} onPress={() =>this.selectTime()} block >
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 0.03 * SCREEN_WIDTH, color: 'white'}}>{this.state.dateSelected ? this.state.hour+':'+this.state.minute+':00' : 'Select Time'}</Text>
              </Button>
            </View>

        </ScrollView>
        {
          <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
            <Button block onPress={()=>{
              if(this.state.batchSelected && this.state.dateSelected && this.state.timeSelected){
                this.submitData();
              }
              if(!this.state.batchSelected) {
                ToastAndroid.showWithGravity("Please select batch", ToastAndroid.SHORT, ToastAndroid.CENTER)
              }
              if(!this.state.dateSelected && !this.state.timeSelected){
                ToastAndroid.showWithGravity("Please select test timing", ToastAndroid.SHORT, ToastAndroid.CENTER) 
              }
            }}>
              <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH, color: 'white'}}>Next</Text>
            </Button>
          </View>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#F0F9FB',
    alignItems: 'center',
    marginBottom: 100
  },
   h2: {
    fontFamily: 'Montserrat-Bold',
     fontSize: 0.06 * SCREEN_WIDTH,
    paddingBottom: 0.05 * SCREEN_HEIGHT,
    paddingTop: 0.05 * SCREEN_HEIGHT,
    color: 'white',
  },
   h3: {
    paddingBottom: 20,
    paddingTop: 20,
    fontSize: 20,
    color: 'white',
  },
  flatListContainer: {
    marginTop: 20,
    flex: 1
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  classTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center',
    marginTop: 0.05 * SCREEN_HEIGHT,
  },
  classContainer: {
    borderWidth: 0.003 * SCREEN_WIDTH, 
    borderRadius: 2 * SCREEN_WIDTH, 
    padding: 0.03 * SCREEN_WIDTH,
    paddingTop: 0.02 * SCREEN_WIDTH,
    paddingBottom: 0.02 * SCREEN_WIDTH,
    borderColor: 'black',
    marginLeft: 0.02 * SCREEN_WIDTH,
    marginRight: 0.02 * SCREEN_WIDTH
  },
  classContainerText: {
    color: 'black',
    fontSize: 0.04 * SCREEN_WIDTH,
    fontFamily: 'Montserrat-Regular'
  },
  userTypeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  userTypeItemContainerSelected: {
    opacity: 1,
  },
  userClassItemContainer: {
    height: 0.05 * SCREEN_HEIGHT, 
    width: 0.2 * SCREEN_WIDTH, 
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    borderRadius: 0.1 * SCREEN_WIDTH,
    borderWidth: 0.003 * SCREEN_WIDTH,
    borderColor: 'white'
  },
  userClassItemContainerSelected: {
    opacity: 1,
    backgroundColor: 'rgba(164, 139, 206, 1)',
  },

  userTypeMugshot: {
    margin: 4,
    height: 80,
    width: 80,
  },
  userTypeMugshotSelected: {
    height: 110,
    width: 110,
  },
  userTypeLabel: {
    color: 'yellow',
    fontFamily: 'Montserrat-Regular',
    fontSize: 11,
  },
  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 0.003 * SCREEN_WIDTH,
    borderColor: 'rgba(164, 139, 206, 1)',
    height: 45,
    marginVertical: 10,
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontFamily: 'light',
    fontSize: 16,
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  inputStyleName: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'light',
    color: '#211482',
   fontSize: 35,
   fontFamily: 'Montserrat-SemiBold',
  },
  nextButton: {
    position: 'absolute',
    height: 0.07 * SCREEN_HEIGHT,
    width: '100%',
    bottom: 0,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7741cd'
  },
});