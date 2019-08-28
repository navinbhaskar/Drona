import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon, H3, ListItem } from 'native-base';
import {View, Image, Dimensions, StyleSheet, ScrollView, FlatList, BackHandler } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import axios from "axios";
import {NavigationActions} from 'react-navigation';

const screen = Dimensions.get('window'),
 vh = screen.height / 100,
 vw = screen.width / 100;

export default class testPerformance extends Component {

  static navigationOptions = {
      header: null
  };

  constructor(props) {
    super(props);
    this._renderList = this._renderList.bind(this);
    this.state = {
      blocks: [],
      performance: [],
      isReady: false
      }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

    _renderList({item, index}){
        return (
            <View style={{flexDirection:'row', width: '90%', borderRadius: 2 * vw , marginBottom: 2 * vh, alignSelf: 'center', elevation: 0, backgroundColor: 'rgba(256,256,256,0.8)', padding: 4* vw, }} >
                <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw, flex:10}}>{item.name}</Text>
                <View style={{flexDirection: 'row', flex: 8, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'Montserrat-Regular', fontSize: 4 * vw }}>{item.points} / {item.total}</Text>
                </View> 
            </View>
        );
    }


   componentDidMount() {
    console.log("ankajssL: "+JSON.stringify(this.props.navigation.state.params));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    axios.post(`https://classcast-198812.appspot.com/teachersapp/viewTestData/`, {"test_id": this.props.navigation.state.params.test_id})
        .then(response=> {
            console.log("sanisnsao"+JSON.stringify(response.data));
            this.setState({
              performance: response.data.performance,
              blocks: response.data.blocks,
              isReady: true
            });
        })
        .catch((error) =>{
            console.log('error');
        });
   }

    render() {
        
    return (
      <View style={styles.container}>
      <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 6 * vw, paddingBottom: 1 * vh, paddingTop: 5 * vh, color: 'black', textAlign: 'center'}}>Test Performance</Text> 
        <ScrollView>
        { this.state.isReady &&
          <View style={styles.aboutUserSection}>
            
              <View style={{flexDirection: 'row', padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Exam Name:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.props.navigation.state.params.exam_name}</Text>
              </View>
              <View style={{flexDirection: 'row',padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, textAlign: 'left', marginLeft: 5 * vw}}>Subject:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.props.navigation.state.params.package}</Text>
              </View>
              <View style={{flexDirection: 'row', padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Chapters:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.props.navigation.state.params.sections}</Text>
              </View>
              <View style={{flexDirection: 'row',padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Standard:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.props.navigation.state.params.class}</Text>
              </View>
              <View style={{flexDirection: 'row',padding: 1*vh}}>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>Timing:</Text>
                  <Text style={{ flex: 1,fontFamily: 'Montserrat-Regular', fontSize: 4 * vw,  textAlign: 'left', marginLeft: 5 * vw}}>{this.props.navigation.state.params.time}</Text>
              </View>
            </View>
      } 

      <Button primary style={{ backgroundColor: '#A48BCE', alignSelf:'center',marginTop: 2 * vh, marginBottom: 2 * vh}}
      onPress={() => {
                      const navigateAction = NavigationActions.navigate({
                        routeName: 'renderQuestions',
                        params: {
                          blocks: this.state.blocks,
                          goal: this.props.navigation.state.params.exam_name,
                          duration: 30,
                          subject: this.props.navigation.state.params.package,
                          path: ''
                        }
                      });
                      this.props.navigation.dispatch(navigateAction); 
                      }}>
            <Text>View Test</Text>
      </Button>

      <View style={{borderRadius: 1.5 * vh, width: '100%', padding : 2* vh, backgroundColor:"white", marginTop: 3* vh, marginBottom: 5*vh}}>
            <ListItem style={{flexDirection:'row', width: '90%', marginBottom: 1 * vh, alignSelf: 'center'}} >
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw, flex:10}}>Name</Text>
                <View style={{flex: 6}}>
                    <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 4 * vw}}>Marks</Text>  
                </View>
            </ListItem>
            { this.state.isReady &&
              <FlatList 
                  data={this.state.performance}
                  renderItem={this._renderList}
                  />   
            }
        </View>    

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   paddingTop: 2.5 * vh,
   flex: 1,
   backgroundColor: '#f0f3fa'
 },
 userImageContainer: {
  height: 30 * vw,
  width: 30 * vw,
  borderRadius: 15 * vw,
  padding: 0.6 * vw,
  backgroundColor: '#f32a76',
  alignSelf: 'center'
 },
 userImage: {
   height: '100%',
   width: '100%',
   alignSelf: 'center'
 },
 aboutUserSection:{
   marginTop: 2 * vh,
   width: '100%',
   borderRadius: 1.5 *vw,
   backgroundColor: 'white',
   padding: 2.5 *vh
 },
})