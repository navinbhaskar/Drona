import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, H1, Icon } from 'native-base';
import {View, TextInput, Dimensions, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import  firebase from 'react-native-firebase';


const screen = Dimensions.get('window'),
  vh = screen.height / 100,
  vw = screen.width / 100; 

export default class messageCreater extends Component {

static navigationOptions = {
    header: null,
    };

constructor(props) {
        super(props);
        this.state = {
        text: '',
        uri: '',
        fileName: '',
        uploading: false,
        imgSource: '',
        imageUri: '',
        progress: 0
        }
    }

_renderUploadList({item, index}){
  return (
      <ListItem style={{flexDirection:'row', width: '100%', flex:8}}>
         <Icon type="FontAwesome" name="upload" style={{fontSize: 30, color: 'white', margin: 5}} />
          <Text style={{color:'white', margin:10, fontSize: 11}}>{this.state.progress}</Text>
      </ListItem>
  );
  }
    
  render() {
    return (
      <Container style={{backgroundColor:'#101E3D', flex: 1, width: 100*vw }}>
        <Content style={{padding:10, height: 100*vh}}>
            <View style={{margin: 5}}>
                <H1 style={{color:'white', margin:10}}>Create your message</H1>
                <TextInput
                    style={{borderBottomColor: 'white', borderBottomWidth: 2, color:'white', margin: 10}}
                    multiline ={true}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    placeholder={'Please type your message here'}
                    placeholderTextColor={'white'}
                />
                <Button style={{backgroundColor: 'red', padding: 5, margin: 10}} 
                        onPress={()=>
                          {
                            DocumentPicker.show({
                              filetype: [DocumentPickerUtil.allFiles()],
                            },(error,res) => {
                              // Android
                              console.log(
                                 res.uri,
                                 res.type, // mime type
                                 res.fileName,
                                 res.fileSize
                              );
                              this.setState({uri: res.uri});
                              this.setState({fileName: res.fileName})
                            });
                        }}>
                    <Icon type="FontAwesome" name="upload" style={{fontSize: 30, color: 'white', margin: 5}} />
                    <Text style={{color:'white', margin:10, fontSize: 11}}>Attach a file(notes, assignment, tests)</Text>
                </Button>
                
                <Button style={{backgroundColor: 'red', padding: 5, margin: 10}} 
                        onPress={()=>
                          {
                            firebase.storage()
                            .ref(`something/${this.state.fileName}`)
                            .putFile(this.state.uri).on(
                                firebase.storage.TaskEvent.STATE_CHANGED,
                                (snapshot) => {
                                let state = {};
                                this.setState({
                                  progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
                                });
                                console.log("progress:" + this.state.progress);
                                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                                  const allImages = this.state.images;
                                  state = {
                                    ...state,
                                    uploading: false,
                                    progress: 0,
                                  };
                                }
                                this.setState(state);
                              },
                                (error) => {
                                console.error(error);
                                },
                            );
                        }}>
                    <Icon type="FontAwesome" name="upload" style={{fontSize: 30, color: 'white', margin: 5}} />
                    <Text style={{color:'white', margin:10, fontSize: 11}}>{this.state.progress}</Text>
                </Button>
                <View style={{margin: 30, marginLeft:30 * vw, justifyContent: 'flex-end'}}>
                    <Button iconLeft light style={{padding:5}}>
                        <Text style={{color:'black', margin:5, fontSize: 13}}>Send</Text>
                        <Icon type="FontAwesome" name="chevron-right" style={{fontSize: 30, color: '#101E3D', marginRight: 5}} />
                    </Button>
                </View>
            </View>
            
            
        </Content>
      </Container>
    );
  }
}