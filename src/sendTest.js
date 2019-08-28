import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Input, DatePicker} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, ScrollView, StyleSheet, Dimensions, LayoutAnimation, TextInput, Picker, ToastAndroid, TimePickerAndroid, DatePickerAndroid, alert } from 'react-native';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const USER_STUDENT = require('./images/user-student.png');
const USER_HP = require('./images/user-hp.png');


export default class sendTest extends Component {

  static navigationOptions = {
      header: null,
      };
  constructor(props) {
      super(props);
      this.setSelectedClass = this.setSelectedClass.bind(this);
      this.submitData = this.submitData.bind(this);
      this.renderItem = this.renderItem.bind(this);
      this.selectTime = this.selectTime.bind(this);
      this.selectDate = this.selectDate.bind(this);
      this.state = {
        testData: [],
        selectedClassIndex: 0,
        selectedGoalIndex: 0,
        selectedSubjectIndex: 0,
        batchList: [],
        standard: null,
        classSelected: false,
        batchSelected: false,
        batch_id: null,
        message: '',
        validMessage: false,
        hour: 0,
        minute: 0,
        year: 2019,
        month: 1,
        day: 1,
        dateSelected: false,
        timeSelected: false
      }
  }


  renderItem = ({item}) => {
    console.log("itemdata: "+JSON.stringify(item));
    if(item.fields.standard == this.state.standard){
      return (
        <TouchableNativeFeedback
        onPress={()=> {
          this.setState({batch_id: item.fields.batch_id});
          this.setState({batchSelected: true});
        }}>
        <View style={[
          {height: 0.05 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderColor: 'white', opacity: 0.6, borderWidth: 0.005 * SCREEN_WIDTH, margin: 0.01*SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center'},
          this.state.batch_id==item.fields.batch_id && { backgroundColor: 'rgba(110, 120, 170, 1)', opacity: 1},
        ]}>
            <Text style={{color: 'white', margin: 0.02 * SCREEN_WIDTH}}>{item.fields.batch_id}</Text>
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

  setSelectedClass (standard){
    this.setState({
                    classSelected: true,
                    batchSelected: false,
                    batch_id: null
                  });
    LayoutAnimation.easeInEaseOut() || this.setState({ standard });
  }

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

  componentDidMount() {
    axios.get(`https://classcast-198812.appspot.com/teachersapp/batch_list_without_student_count/`)
        .then(function (response){
            console.log("abcd: "+JSON.stringify(response.data));

            this.setState({batchList: response.data})
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });

  }

  submitData() {
    console.log("doandasldas: "+new Date(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute));
    console.log("abcdef: "+JSON.stringify(this.props.navigation.state.params.data.test_id));
    data = {
      "test_id": this.props.navigation.state.params.data.test_id,
      "batch_id": this.state.batch_id,
      "standard": this.state.standard,
      "message": this.state.message,
      "date": new Date(),
      "deadline": new Date(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute)
    }

    axios.post(`https://classcast-198812.appspot.com/teachersapp/sendTestToStudents`, data)
      .then(response => {
          this.props.navigation.navigate('Home');          
      })
      .catch(error => {
          console.log('error');
      });
    
  }


  renderItem = ({item}) => {
    console.log("itemdata: "+JSON.stringify(item));
    if(item.fields.standard == this.state.standard){
      return (
        <TouchableNativeFeedback
        onPress={()=> {
          this.setState({batch_id: item.fields.batch_id});
          this.setState({batchSelected: true});
        }}>
        <View style={[
          {height: 0.05 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderColor: 'white', opacity: 0.6, borderWidth: 0.005 * SCREEN_WIDTH, margin: 0.01*SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center'},
          this.state.batch_id==item.fields.batch_id && { backgroundColor: 'rgba(110, 120, 170, 1)', opacity: 1},
        ]}>
            <Text style={{color: 'white', margin: 0.02 * SCREEN_WIDTH}}>{item.fields.batch_id}</Text>
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
    console.log("abcdef: "+JSON.stringify(this.props.navigation.state.params.data.test_id));
    const { selectedClassesIndex, selectedStreamIndex, name, gender, username, usernameValid, standard } = this.state
    console.log("gender: "+this.state.gender)
    return (
      <View style={{backgroundColor: '#293046', height: '100%'}}>
        <ScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text style={styles.h2}> Create Test</Text>
          <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT}]}>Select Class</Text>
          <View style={styles.classTypesContainer}>
            <UserClass
              label="Class-11"
              labelColor="white"
              image={USER_STUDENT}
              onPress={() => this.setSelectedClass(11)}
              selected={this.state.standard === 11}
            />
            <UserClass
              label="Class-12"
              labelColor="white"
              image={USER_HP}
              onPress={() => this.setSelectedClass(12)}
              selected={this.state.standard === 12}
            />
            <UserClass
              label="Class-12+"
              labelColor="white"
              image={USER_HP}
              onPress={() => this.setSelectedClass(13)}
              selected={this.state.standard === 13}
            />
      </View>
      

      { this.state.classSelected && 
        <View style={{width: '75%'}}>
          <FlatList
            style={[styles.flatListContainer, {alignSelf: this.state.standard == 11? 'flex-start': this.state.standard == 13? 'flex-end': 'center'}]}
            data={this.state.batchList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
        </View>
      }

      <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, marginTop: 0.04 * SCREEN_HEIGHT}]}>Message</Text>
      <View style={{ width: '75%', alignItems: 'center', height: 0.08 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderWidth: 2, borderColor: this.state.validMessage ? 'white': this.state.submitAttempted ? 'red': 'white', justifyContent: 'center', alignItems: 'center', marginTop: .05 * SCREEN_WIDTH}}>
        <TextInput
          style={{width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'white', textAlign: 'center',}}
          placeholder='Message'
          placeholderTextColor= 'white'
          onChangeText={(text) => {
            this.setState({message: text});
            if(text.length>0){
              this.setState({validMessage: true})
            }
            else {
              this.setState({validMessage: false}) 
            }
          }}
        />
        </View>

        <Text style={[styles.classContainerText,{marginBottom: 0.02 * SCREEN_HEIGHT, marginTop: 0.04 * SCREEN_HEIGHT}]}>Select Timing</Text>
        <View style={{flexDirection: 'row'}}>
          <Button style={{ backgroundColor: 'grey'}} onPress={() =>this.selectDate()} block >
            <Text>{this.state.dateSelected ? this.state.day+'/'+this.state.month+'/'+this.state.year : 'Select Date'}</Text>
          </Button>
          <Text>  </Text>
          <Button style={{ backgroundColor: 'grey'}} onPress={() =>this.selectTime()} block >
            <Text>{this.state.dateSelected ? this.state.hour+':'+this.state.minute+':00' : 'Select Time'}</Text>
          </Button>
        </View>


        </ScrollView>
        { this.state.classSelected && this.state.batchSelected && this.state.validMessage && this.state.dateSelected && this.state.timeSelected &&
        <TouchableNativeFeedback
               onPress={() => {
                this.submitData()
              }}
            >
              <View style={styles.nextButton}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH, color: 'white'}}>Send</Text>
              </View>
        </TouchableNativeFeedback>
      }
      </View>
    );
  }
}


export const UserTypeItem = props => {
  const { image, label, labelColor, selected, ...attributes } = props;
  return (
    <TouchableNativeFeedback {...attributes}>
      <View
        style={[
          styles.userTypeItemContainer,
          selected && styles.userTypeItemContainerSelected,
        ]}
      >
        <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
        <Image
          source={image}
          style={[
            styles.userTypeMugshot,
            selected && styles.userTypeMugshotSelected,
          ]}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

export const UserClass = props => {
  const { image, label, labelColor, selected,...attributes } = props;
  return (
    <TouchableNativeFeedback {...attributes}>
      <View
        style={[
          styles.userClassItemContainer,
          selected && styles.userClassItemContainerSelected,
        ]}
      >
      <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};


const styles = StyleSheet.create({
  
  container: {
    paddingBottom: 0.1 * SCREEN_HEIGHT,
    paddingTop: 0.05 * SCREEN_HEIGHT,
    backgroundColor: '#293046',
    alignItems: 'center',
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
    borderWidth: 3, 
    borderRadius: 2 * SCREEN_WIDTH, 
    padding: 0.02 * SCREEN_WIDTH, 
    borderColor: '#ffffff',
    marginLeft: 0.02 * SCREEN_WIDTH,
    marginRight: 0.02 * SCREEN_WIDTH
  },
  classContainerText: {
    color: 'white',
    fontSize: 0.04 * SCREEN_WIDTH,
    fontFamily: 'Montserrat-SemiBold'
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
    borderWidth: .005 * SCREEN_WIDTH,
    borderColor: 'white'
  },
  userClassItemContainerSelected: {
    opacity: 1,
    backgroundColor: 'rgba(110, 120, 170, 1)',
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
    fontFamily: 'bold',
    fontSize: 11,
  },
  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
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