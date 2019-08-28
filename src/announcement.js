import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, Footer , ListItem, Input} from 'native-base';
import {View, Image, FlatList, TouchableNativeFeedback, ScrollView, StyleSheet, Dimensions, LayoutAnimation, TextInput, Picker, ToastAndroid, BackHandler } from 'react-native';
import axios from "axios";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class announcement extends Component {

  static navigationOptions = {
      header: null,
      };
  constructor(props) {
      super(props);
      this.setSelectedClass = this.setSelectedClass.bind(this);
      this.setSelectedAction = this.setSelectedAction.bind(this);
      this.submitData = this.submitData.bind(this);
      this.renderItem = this.renderItem.bind(this);
      this.state = {
        selectedClassesIndex: 3,
        selectedStreamIndex: 2,
        loading: false,
        selectedType: null,
        fontLoaded: false,
        phone:'',
        phoneValid: false,
        text: '',
        standard: null,
        gender: null,
        batch_id: null,
        validMessage: false,
        genderSelected: false,
        classSelected: false,
        submitAttempted: false,
        message: '',
        batchList: [],
        batchSelected: false,
        actionSelected: false,
        action: null,
        URL: null
      }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    axios.get(`https://classcast-198812.appspot.com/teachersapp/batch_list_without_student_count/`)
        .then(function (response){
            console.log("abcd: "+JSON.stringify(response.data));
            this.setState({batchList: response.data})
        }.bind(this))
        .catch(function (error) {
            console.log('error');
        });
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  submitData() {
    console.log("dabsksabdkaL: "+this.state.standard);
    standard_array = []
    standard_array.push(this.state.standard)
    var data = {
                "standard": standard_array,
                "message": this.state.message,
                "batch_id": this.state.batch_id,
                "payload": this.state.URL,
                "action": this.state.action,
                "date": new Date()
              }
      axios.post('https://classcast-198812.appspot.com/teachersapp/announcement', data)
            .then((response) => 
            {
              this.props.navigation.goBack(null);
            })
            .catch((error) => {
              this.setState({loading: false});
            })
            
  }


  setSelectedAction (action){
    this.setState({
                  actionSelected: true,
                  action: action,
                });
    LayoutAnimation.easeInEaseOut() || this.setState({ action });
  }

  setSelectedClass (standard){
    this.setState({classSelected: true});
    this.setState({ batch_id: null });
    this.setState({batchSelected: false});
    LayoutAnimation.easeInEaseOut() || this.setState({ standard });
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
          {height: 0.05 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderColor: 'black', borderWidth: 0.003 * SCREEN_WIDTH, margin: 0.01*SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', padding: 0.03 * SCREEN_WIDTH, paddingTop: 0.02 * SCREEN_WIDTH, paddingBottom: 0.02 * SCREEN_WIDTH},
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
    console.log("gender: "+JSON.stringify([].push("12")))
    return (
      <View style={{height: '100%', width: '100%', backgroundColor: '#D8EBED'}}>
      <ScrollView
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 0.06 * SCREEN_WIDTH, paddingBottom: 0.01 * SCREEN_HEIGHT, paddingTop: 0.05 * SCREEN_HEIGHT, color: 'black', textAlign: 'center'}}> New Announcement</Text>
        <Text style={[styles.classContainerText,{ marginTop: 0.04 * SCREEN_HEIGHT}]}>Message</Text>
        <View style={{ width: '75%', alignItems: 'center', height: 0.08 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderWidth: 0.003 * SCREEN_WIDTH, borderColor: this.state.validMessage ? 'white': this.state.submitAttempted ? 'red': 'black', justifyContent: 'center', alignItems: 'center', marginTop: .05 * SCREEN_WIDTH}}>
         <TextInput
          style={{width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'black', textAlign: 'center',}}
          placeholder='Message'
          placeholderTextColor= 'black'
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
        { this.state.submitAttempted && !this.state.validMessage &&
          <Text style={{color: 'red'}}>Please enter your message</Text>
        }
        <Text style={[styles.classContainerText,{ marginTop: 0.04 * SCREEN_HEIGHT}]}>Select Standard</Text>
        <View style={styles.classTypesContainer}>
            <UserClass
              label="Class-11"
              labelColor="black"
              onPress={() => this.setSelectedClass(11)}
              selected={this.state.standard === 11}
            />
            <UserClass
              label="Class-12"
              labelColor="black"
              onPress={() => this.setSelectedClass(12)}
              selected={this.state.standard === 12}
            />
            <UserClass
              label="Class-12+"
              labelColor="black"
              onPress={() => this.setSelectedClass(13)}
              selected={this.state.standard === 13}
            />
      </View>

      { this.state.classSelected && 
        <View style={{width: '75%'}}>
        <Text style={[styles.classContainerText,{ marginTop: 0.04 * SCREEN_HEIGHT, alignSelf: 'center'}]}>Select Batch</Text>
        <FlatList
          style={[styles.flatListContainer, {alignSelf: this.state.standard == 11? 'flex-start': this.state.standard == 13? 'flex-end': 'center'}]}
          data={this.state.batchList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />
      </View>
      }

      { this.state.submitAttempted && !this.state.classSelected &&
        <Text style={{color: 'red'}}>Please select class</Text>
      }

      <Text style={[styles.classContainerText,{ marginTop: 0.04 * SCREEN_HEIGHT, alignSelf: 'center'}]}>Select Action</Text>
      <View style={styles.classTypesContainer}>
            <ActionType
              label="PDF"
              labelColor="black"
              onPress={() => this.setSelectedAction('pdf')}
              selected={this.state.action === 'pdf'}
            />
            <ActionType
              label="WEB URL"
              labelColor="black"
              onPress={() => this.setSelectedAction('url')}
              selected={this.state.action === 'url'}
            />
            <ActionType
              label="None"
              labelColor="black"
              onPress={() => this.setSelectedAction('none')}
              selected={this.state.action === 'none'}
            />
      </View>

      <Text style={[styles.classContainerText,{ marginTop: 0.04 * SCREEN_HEIGHT, alignSelf: 'center'}]}>Enter Url</Text>
      { this.state.actionSelected &&  
        <View style={{ width: '75%', alignItems: 'center', height: 0.08 * SCREEN_HEIGHT, borderRadius: 0.1 * SCREEN_WIDTH, borderWidth: 0.003 * SCREEN_WIDTH, borderColor: 'black', justifyContent: 'center', alignItems: 'center', marginTop: .05 * SCREEN_WIDTH }}>
        <TextInput
          style={{width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'black', textAlign: 'center',}}
          placeholder=' URL ' 
          placeholderTextColor= 'black'
          onChangeText={(text) => {
            this.setState({URL: text});
        }}
        />
        </View>
      }
        
    
      <View style={{flexDirection: 'row', height: 0.1 * SCREEN_HEIGHT, width: '75%', justifyContent: 'space-between', marginTop: 0.05 * SCREEN_HEIGHT}}>

      <Button primary style={{ backgroundColor: '#A48BCE', alignSelf:'center',marginTop: 10}}
                onPress={()=>this.props.navigation.goBack(null)}>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'white'}}>Dismiss</Text>
      </Button>
      
      <Button primary style={{ backgroundColor: '#A48BCE', alignSelf:'center',marginTop: 10}}
                onPress={()=>{
                  this.setState({submitAttempted: true});
                  if(!this.state.batchSelected) {
                    ToastAndroid.showWithGravity("Please select batch", ToastAndroid.SHORT, ToastAndroid.CENTER)
                  }
                  if( this.state.validMessage && this.state.classSelected && this.state.actionSelected && this.state.batchSelected){
                    this.submitData();
                  }
                }}>
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 0.04 * SCREEN_WIDTH, color: 'white'}}>Send</Text>
      </Button>

      </View>
      </ScrollView>
    </View>
    );
  }
}

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
      <Text style={[styles.userTypeLabel, { color: labelColor }, selected && {color: 'white'}]}>
          {label}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};


export const ActionType = props => {
  const { label, labelColor, selected,...attributes } = props;
  return (
    <TouchableNativeFeedback {...attributes}>
      <View
        style={[
          styles.userClassItemContainer,
          selected && styles.userClassItemContainerSelected,
        ]}
      >
      <Text style={[styles.userTypeLabel, { color: labelColor }, selected && {color: 'white'}]}>
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
    backgroundColor: '#D8EBED',
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
    marginTop: 0.005 * SCREEN_HEIGHT,
    flex: 1
  },
  classContainerText: {
    color: 'black',
    fontSize: 0.04 * SCREEN_WIDTH,
    fontFamily: 'Montserrat-Regular'
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
    marginTop: 0.02 * SCREEN_HEIGHT,
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
    borderRadius: 0.1 * SCREEN_WIDTH,
    borderWidth: 0.003 * SCREEN_WIDTH,
    borderColor: 'black'
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
    fontFamily: 'bold',
    fontSize: 11,
  },
  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 0.003 * SCREEN_WIDTH,
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
});