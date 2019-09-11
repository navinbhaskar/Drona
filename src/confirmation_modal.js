import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  BackHandler,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';

const screen = Dimensions.get('window');
  vh = screen.height / 100;
  vw = screen.width / 100;

class Dialog_box extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  })

  constructor(props) {
    super(props);
    this.callbackFunctionYesPressed = this.callbackFunctionYesPressed.bind(this);
    this.callbackFunctionNoPressed = this.callbackFunctionNoPressed.bind(this);
    this.state = {
      isVisible: this.props.data.isVisible,
      }
  }

  callbackFunctionYesPressed = () => {
      this.props.callbackFunctionYesPressed(this.props.data.standard, this.props.data.batch_id);
  }

  callbackFunctionNoPressed = () => {
      this.props.callbackFunctionNoPressed();
  }

  render () {
    console.log("skjnkld: "+this.props.data.batch_id+"||"+this.props.data.standard)
    return(
      <View>
        <Modal
          isVisible={this.props.data.isVisible}
          onRequestClose={() => {
            this.callbackFunctionNoPressed()
          }}>
          <View style={{height: 18 * vh, width: '70%', position: 'absolute', alignSelf: 'center', borderRadius: 2*vw, backgroundColor: 'white'}}>
            <View style={{height: 10 * vh, width: '100%', justifyContent: 'center'}}>
              <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, marginLeft: 2 * vw, marginRight: 2 * vw, color: 'black'}}> {this.props.data.text} </Text>
            </View>
            <View style={{flexDirection: 'row', height: 8 * vh}}>
              <TouchableNativeFeedback onPress={()=>{
                if(this.props.data.action == 'exit'){
                  BackHandler.exitApp();
                }
                else{
                  this.callbackFunctionYesPressed();
                }
              }}>
                <View style={{height: 8 * vh, width: '50%', backgroundColor: '#323131', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 2 * vw}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, color: '#ffffff'}}> Yes </Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={()=> this.callbackFunctionNoPressed()}>
                <View style={{height: 8 * vh, width: '50%', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 2 * vw}}>
                  <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw}}> No </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>
      </View>
      )
  }
}

export default Dialog_box

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEAEA',
  },
  txtContainer: {
    width:'100%',
    backgroundColor: '#ffffff',
    marginLeft: '3%',
    marginRight: '3%',
    elevation: 6,
    padding: 5,
    borderRadius: 5,
  },
})
