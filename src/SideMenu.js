import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions, StackActions} from 'react-navigation';
import {Icon, ListItem} from 'native-base';
import {ScrollView, Text, View, Image, TouchableOpacity, Linking, TouchableNativeFeedback, BackAndroid, BackHandler} from 'react-native';
import firebase from 'react-native-firebase';
import axios from "axios/index";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';


class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  constructor(props) {
    super(props);
    this.signOutUser = this.signOutUser.bind(this);
    this.state = {
      teacher_id: null,
      name: null,
      student_count: 0,
      course_count: 0,
      photo: ''
    }
  }

  handleBackPress = () => {
    this.props.navigation.closeDrawer();
    return true;
  };


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    await firebase.auth().onIdTokenChanged( (user) => {
        console.log("dsnlfDMKF:");
        if(user) {
          console.log("dsnlfDMKFuser: "+JSON.stringify(user));
          console.log("dsnlfDMKFuser: "+user.email.split('@')[0]);
          this.setState({username: user.email.split('@')[0] });
          let jwtToken = firebase.auth().onAuthStateChanged(user => {
            if (user) {
              user.getIdToken().then(idToken => {
                  console.log("dsnlfDMKFtoken: "+idToken);
                  axios.defaults.headers.common['Authorization'] = idToken;
                  axios.get(`https://classcast-198812.appspot.com/teachersapp/teacher_data`)
                    .then(function (response){
                        console.log(JSON.stringify(response.data.teacher_id));
                        this.setState({teacher_id: response.data.teacher_id});
                        this.setState({name: response.data.name});
                        this.setState({student_count: response.data.student_count});
                        this.setState({course_count: response.data.courses});
                        this.setState({photo: response.data.photo});
                    }.bind(this))
                    .catch(function (error) {
                        console.log("nsajaskf"+error);
                    });
              })
            }
          })
        }
      });
  }

  signOutUser = async () => {
    console.log("working");
    try {
        this.props.navigation.closeDrawer();
        //this.props.navigation.dispatch(StackActions.popToTop());
        this.props.navigation.navigate('Authstack', {}, NavigationActions.navigate({ routeName: 'authCheck' }));
        await firebase.auth().signOut();
        BackHandler.exitApp();
    } catch (e) {
        console.log("asgisaais"+e);
    }
  }

  render () {
    console.log("asnais: "+JSON.stringify(this.props.navigation.state))
    return (
      <View style={styles.container}>

        <ScrollView>
          <View style={styles.aboutUserSection}>
            <View style={{flexDirection: 'row', marginLeft: 5 * vw}}>
              <View style={styles.userImageContainer}>
                <Image
                  source={{uri: this.state.photo}}
                  style={styles.userImage}/>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.userName}>
                  {this.state.name}
                </Text>

                <View style={{flexDirection: 'row', marginLeft: 2 * vw}}>
                  <Text style={styles.class}>{this.state.student_count+ ` Students`}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 2 * vw}}>
                  <Text style={styles.class}>{this.state.course_count+` Courses`}</Text>
                </View>
              </View>

            </View>
          </View>
          <View style = {styles.viewStyleForLine}></View>
          <View style={{marginTop: 2 * vh}}>
            <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
            <Image
              source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABJlBMVEUAAAAzzP82xPo3xPo3xPk3w/o1v/8zwv83xPo4wvo5xvk4xPo3xPo3xPw2xPo2xPo3xPo2xPo3xPs3xPo3w/oA//82wvk3xPo3xPor1f84xfo3xPo3xPowv/84w/s3xPozxPc2w/o3w/o2xfwuuf83xPk3xPo8w/82w/o3xPo1xfo3xPo3xPk4w/s5xvs3xPo3xPo3w/o3xPo3xPo3xfo3xPo3xPo3yP83w/o3xPo3xPo2xPs2xPo3xPo4xPo3w/o2wfc3xPk3xPo1xPk3xPo3xPs4xPpAv/82xvs1wvszzP83w/o2xfs3xPs2xPs3xfk3wvk4w/k3xPpAv/8A//83xPo3xPo5xvg3xPo3xPo3xPs1w/g5xvY3xPs3xPo2xfs3xPoAAAA2Dm1fAAAAYHRSTlMAD5Li5p4YGdIyKOHzSjTq+2hB8ZEBUPehBmn9vRB31B6Np0sLtvwRxdE164JEOvnbyez0osPeFzP27j34vtPWIefYK6N4ZAhHQwVqdkV1UyqAcAwCy/Uk/vCxIhutwjnQR64dAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+MJBA4eFvR9kS4AAAFjSURBVFjD7ZTXVsJAFEUHRbHETkRQsXexi2A39q5Ysd7//wqDoMlMcjMlsnyZ/ZS1Lvu8nDMQUlUiNbXRunp1P9YANtFGVb+pGb4xWtT81jao0N6h4nd2gUPclPa7E+CmJynpp3qBpq9fyk+Dh4FBcd0cAh/E60wOgy/GiJg/OgYI40J1TkwCjkCdsSkIglvnz3xROHU680UJrJOaL0ZAncx8MdA6PfOVrDMtqCN1+s9XvE5svihMnfh8Uag6A+eL4aqTM1+M3zq588Wo1Dk9o+jbzNp+xlD3AVJkbj6MDwtkMZQPS2Q5XMAKWS1/JEQfEk12jeTypY/1jU1Zd2sbYGe39CeyB2DtE+mAg8jh0XH5HZycnhGFAOY56oBqBMRzbs7lAy6o86UO0AE6QAf8Y8AVdc5wAyz2B9fU+cYTcMsEFJh79o463z8w98cnJsAsWM/Oufjyytzf3osuPf/xSf6IL2xJcbA9QLQ6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTA0VDEyOjMwOjIyKzAyOjAwxWIgtgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0wNFQxMjozMDoyMiswMjowMLQ/mAoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
              style={{
                width: 4 * vw,
                height: 4 * vw,
                alignSelf: 'center'
              }}
            />
              <Text style={styles.navItemStyle} onPress={()=>{
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate('HomeStack', {}, NavigationActions.navigate({ routeName: 'Home' }));
              }}>
                Home
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
              <Image
                source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACXlBMVEUAAAA9wv83xPo3xPo3xPsA//83yP81wvs4xfs3xPs2xPo3xPo3xPo3xPo3xPs3xPo3xfo4xfo5xvkA//83xPs2xPor1f84xPk2xPs3xPo3xPk4xPo1xfo5xv83xPs3xPo3xPo3xPk4xPo2w/o3xPo4xfk6xfg3xPo4xfo2xPo2xPk3xPo2xfk4w/k3xPk2xPo3w/o2xPo8w/83xPo2xPs4w/s3xPpVqv83xPo5w/swv/83xPs5xvY3xPs2xPs4xfs3xPo2w/w2w/k3xfk3xPo3w/k3xPo3xPk2w/o3xfpAv/84w/k1xfo2xPo4xPo3xfo2xPo5xvszzP84w/g3w/s3xPo3xPo2xPo2w/g2w/k3xPo4xPozzP84xPg4w/o2yf83w/s3xPo3xfo3xPo3xPo3xPo2xfs3xPo3xPo7xPU2xPo1xPk3xPo3yPY2xPo3xPk3xPs3xPo3xPk3xPo3xfo3xPw3xPo4xPk5wvs2xPo6xfc3xPo3xPk3w/o3xPk3xPtJtv84xfo3xfo3xPo3w/o3xPo3w/s2xfo4w/s2xPs4xfs3xPtAv/83xPo1w/g2xPo3xPo2xfs3xPo4xPk4xPo3xPk3xPo2xfwzzP83w/o3xPo3xPo5xvg4xfo3xPo3wvkzxPc3xPo3w/o4xfo1wfY3xPo4xPk3xPo5xvk5xv80xPg4xPo3xPo2w/k3w/o3xPk3xPo2xPk3yP84xPw3w/o4xPo3xfo3xPouuf82xvs6xf83xPo3w/o3xPo3xfo3xfk2xPo5xvo3w/o2w/o3xfs4xPo4xPs2xPo3xPoAAADuSV6rAAAAyHRSTlMAFaPLeQIOQ3uwzuDy7uTEnW0tAa2bBlKy++aOMAl4673nnF7isyP3aam3mIiAiqTJ+BHPdUTGA/NIEH0bsXpy/ExVU/W43YGNpgSJNWOXmZI6D02r6PZxJln0oAVONxNzvpU40P05cLoa6ivsHF+2Qf61wdpK+Vs/lh/vi565rAdgzZ9m1OPAdz2qRQzIImi/dvFW4YfZSwpiu9EkbvouHttdZR3wV5QoEielx1GRhqFaF0nWypDVC0cW6ZrtYYPcNmvFRpOuNG36y28AAAABYktHRACIBR1IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wkEDi0sxhotrAAAA3pJREFUWMPVl+lfTGEUx29qtO9aBkN7TYpSTBJFiqloo5Q2MmRpUyiKimyTkEq2lEQJZd/37fmz3HvnmTv3Ps+ZmTv1ynk1c37n9537LJ9zzzCMKOzm2TsojF/mOzo5u7i6IXcPTy9vH19GTixACPnxBP+AQCUSx8JFi2UAPJCBoFqyFNER5GgVEMwXhoSGITjCI2QBLERk1BwBCKlVtgCCo5fFxC5fERcvynmulAtISBRWrFrl5SbkV2tkAZLWSKXktQIiQN4ThCgIMWUdVtbLXIIfefl8U9N4YYPcTdxI6emb2HSGhVudKQFspgsitmijsiycQrbYr8xhbA7N1m25xsjLt93/H4SqYA5m38LtOxAq8iyeJWRnnPF03Etm4y8pFR3wrjKb/eXSBqlV2OiviCQaRba5ysoqZ5fde6qJbNZesi/p9sEbvb/IoNcckOQd6M7mAnUVhVbQDx4S5VWHgd5YCADyRLpHrSlfBzXXetrf0CguOGISmiCArpb0a5qlFUeFFRyDAOg4CSgkCjKMQgvoR60kwJkoaDyBhSoYYE8ewUmyog4rbTAgjAD4UBW5WGmHAZFWtgChU1g5DQNQhxTQSRV0YeWMvCc4S1V0W96DcwQgnao4j5ULMMCFAFykKi5hRQ8D/AhAj5KsSDSr8NFJXiR7skLoCpdBQC8JIC9cptC2rkD+q6SfqSySVlwzra4PAFynAEyspKC/x6QM0P5BfxrQ0S0qaLwhUoYyKQA4c9a6mgpSJYo+jfCHMGD0Gve79CahhEq6FbrVAQOYsqjbrNzXeodS7g6L/NFDjPkouDcCvnYqRo32+GJ4SGqR3gzNfYLTMdbEPcVozAP4l6vHxx+KyCNB6JFAaMCCf+/EJE7lzCf8eu7tG1eON+dxHjcdT+GzdkKBydSWPJGOCU/xOJ0U/sxpesbY4A2z/TT7yfW5eEE+9Wyqy06UyR9GQCRwT6BoxV/GXuC9eDml4zOvUgT/ZD/kV/pwmuka616r3wzM1JjG9rfvjAC473px0nsdMh/t2B8Bdoz4EVb68BFZCjwtfQJFLSe1WfSjfv6cNJ9BUc9KlUmWAegLf4VAKZg7t69W/KjZl78nUKg59jdrAPSdMfzfpeMHq0xY9fP/KX6Cyi8Get1RUcOW/QaVBsbMcCQN7g2crC4FFG9WUf0ZtuIf/Mv8A1lw0q7+SYS6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTA0VDEyOjQ1OjQ0KzAyOjAwr8/CzAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0wNFQxMjo0NTo0NCswMjowMN6SenAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
                style={{
                  width: 4 * vw,
                  height: 4 * vw,
                  alignSelf: 'center'
                }}
              />
                <Text style={styles.navItemStyle} onPress={() => {
                  this.props.navigation.closeDrawer();
                  this.props.navigation.navigate("selectUser", {path: 'home'});
                }}>
                  Change User
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
                <Image
                  source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB5lBMVEUAAAA7yP08yP45yf86yP87yP1Av/87yf47yP4zzP85xv87yP48yP43yP87yP47x/07yP05xv89x/87yv87yP87yP47yP06yP07yP44x/88yP86y/86yf8A//88yP86x/47yP47yP47yP47yf47yP47yP47yP48yP47yP48yf9Vqv87yP47x/0A//87yf88yP87yP46yP48yP47yP47yP47yP47yP49wv87x/07yf87x/08w/86xf87yf8+yP87yf87yP83yP86yP87yf49yP88yf87yP08yP0r1f88yf1Av/87yP45xv9G0f86yv87x/87yP47yP45xv88yP87yP46x/87yP86x/84x/86yf06x/87yP48yf85xv88xv86yP07yP47yP47yf46yP47yP87yf88x/88yP87yP42yf88yP08yP86x/86yP06yP86yv8+yf87yf88y/87yP46yf86yf87yf0zzP87yP47yP1Az/87x/07yP47yP06x/87yP48yP48x/9Ayv87yP47yP08yP46yf86yP87yf47yP06x/5Av/87yP48x/07y/87yP47yP47yf89zP83yP86yP07yP46yP06yP09yf87yP88yP07yP47yP48x/9Jtv88yP87yP4AAACGf4toAAAAoHRSTlMAhvBHRocIztcPCdDWDtSOiyg7KzjVj4zYKTwsOQFdvOTu/Pj38fLju1oDqqUCdW/+2ri+ub3fFZc9nBEfeiU0fRxYtypZlJ4GlgT0Egs+VuXDG2vbckFlIIhu9lUxSJXG7erNcF93Zs8TkXh7nVQwIWMi3UtCkgXgnxCT/YJt+8k3GPmB0nZh3IqzDMyAJ/q6aBkXkOmmmVBFp+vRfAdz8u8P0gAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCQUKExAXBYXvAAAC/klEQVRYw82X+1cSQRTHJ8vyQUgPTQwCTM0icqU009TMMgIqg8ooK0uyUItKi0rTiuxd9rZ3909tdnYXdmd22VnO6Zy+P3DvmbPfz87MvcPuIpTTspLlUrKipJTElavKyklSUWlbjcxlhyopcUAZiWsA1pJkHcB6DkA11EjJBqgl0QlQR5KNAK5/CXBv8nh9WPWw2UfUAPUkNgI0aZItzVvdrH+bHyxoe4AB7LDiB2hhFuAFEJr9WI3Q6ieqhSYSgwA7SbILoE2MHgGgnQbsxtQOuYw1Shlzm7hHu4md+OIuCrAXj3WTrBIc0lAp2EnsUcqPG6KXJPvwxX2GgP39B6QhZ/9BEgMDh0JScrgzzAHg0H8BiETF5EjRgMhRHI4NwvFYcQDij+N2gBOxYgAnT+GfIYG0ZPvpIgBh5f6Qn4MKUNGd0NcZ1RnsO5s7FhJBBRg2PEHnVLM436AlqADlF/z6SoQVd7yFIVjag7ggaAkj1gDi/lGELiuAuHDRRxEuBSwA4sJo1IWvFpJ5wmULSxD97g7QEMYQP+CKcDXlHpdnPoEfX5gwSfVB6ppBGcdD0v0VvzyHMUQBrhs2Ulrrlwg3EA0IJQ1a+SbtlwgMwFBD6vXLmrQAKOjnABT2mwNM/KYAM78ZwNRvAjD3qwG3RqdoMfUnbWwEmGZb0NyvWcLtYY2CPP4Ce8Cx/oIA0v93mPsHMpyAuHBX138vxgfA/58j92d0/MAHcM6KR1bPzwl4wFZU3P854AXYYV7HT95QuAA90Kp6eOTrxw2YgATSEOT6cwMewiPNA0zpH15ATPCKbwQ5Qq7/eAFzMEOiTMj3Ly+gDWyPSTKd1Z4fTkAKl1AkpJ8s4G56iiwDnonztjmm8O/zF2lkHfBS3rvqRB31hcMHeCVu3ezrN28RIz5ALyy+e/8B6YkP4HZ1IQPpAT7isU+IUwP44ig1FvgMsPhlKa+vCGW+VS3p6Tuu7yDz5cgc/R8/I2CsX8y0fnvAgoIZdmGZP/Ysnzu7kAzT7r+rzVoKvM/yQwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wOS0wNVQxMDoxOToxNiswMDowMH/mfRwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDktMDVUMTA6MTk6MTYrMDA6MDAOu8WgAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='}}
                  style={{
                    width: 4 * vw,
                    height: 4 * vw,
                    alignSelf: 'center'
                  }}
                />
                <Text style={styles.navItemStyle} onPress={() => {
                  const navigateAction = NavigationActions.navigate({
                        routeName: 'Attendance'
                      });
                      this.props.navigation.dispatch(navigateAction);
                }}>
                  Take Attendance
                </Text>
              </View>
            </View>

          <View>
          <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
            <Image
              source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABVlBMVEUAAAAr1f88yP87yP48yP47yP47yP46yP07yf86xf87yP47yf09wv87yP48yP08x/9Av/87yP47yP46yv87yP46yP87yP48yf87x/87yP47yP5Jtv88xv86yP07yf86yP88yP47yP47yP47x/46yf9G0f9AzP8zzP87yP46y/87yP47yP47xP87yP85xv87yP47yP47yP5Az/87yP47yf49xv87yP47yP06yf07yP47yP47yP47yP47yP88yP48yP88yP07yP48yf47yf85xv88w/86xf87yP5Vqv87yf87yf47yP47yP47yP05xv8zzP87x/08x/88x/88yP47yf86x/86yP85yv9Ayv87yf87yP46yP47yP49yP83yP87x/47x/88x/07yP47yP4+yP8A//86yP87y/86yP46xf88yP87yP48yf88yP89x/87yP07yP4AAADcqCnbAAAAcHRSTlMABma64+7Yoj0j1JsV4J5EDPetPudT/VVJ3egHSKY0T7Tp9Mp2CxQK3izy5hp9Evu1+hDC6j/+iojGquvRSvAzmu/FbC0RFtcDddzMz48kBZN3fMljaVRDGGe5zfYuHNNOgOT1JQFcJ9ofPPxRYjKjIHJ08wAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCQUKDBI0UepdAAABqklEQVRYw+3V6VcBURzG8UuLkCVlkKRItCLSJlJR2oj2UCnty/3/X9WhZu4MZ8z9jTp1Ts9r38/hzj0DoZZOoWxr75C6TlWXsFdrMN20Cl7fraPsMdbzAC11j7GB6I09AMBEAL2AHvcRgBkCMARggQD4H+ABVpuE9YsA0mYfcDCygI8N2gSAc2hY8k92uUc8aFRDAl4T5bH5xpB6nABoe4wnJtEUBzgBj06Fpv0sEAAAwRkUYoEwAMCzSM8CEQhgRnMsAOmxBc3/UmBhkTfTEiUQFV76ZUogZo3zt/IXDjEhF1iVC6yRQHg9KbKUqgGgsZPAxqbomyxdD2ypEe8n6LZFtuMXAondJOIDFGewZzCsZ6pfDAhwayXAZPdFlvM1BfLi/ycHTYFgTimyw+j3n8EPAkcEEIMAxwQQAvTMCQGcAoAz8ulmzqn7QpF3P0oXlL3rUnDDPFdlivzacVN/SSul2mv8lvhgIN5wd3ax2x7n+rwRAcYB9ylIzwHlB1DPArEirP8CCo/A/hN4eob2NSDyAu5rQBreV4GsjB69YvxWkQN43Y6MnB60d4fLZUevgv44AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTA1VDEwOjEyOjE4KzAwOjAw1zn9tgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0wNVQxMDoxMjoxOCswMDowMKZkRQoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
              style={{
                width: 4 * vw,
                height: 4 * vw,
                alignSelf: 'center'
              }}
            />
                <Text style={styles.navItemStyle} onPress={() => {
                  this.props.navigation.navigate('Message')
                }}>
                  Chat
                </Text>
          </View>

          <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
            <Image
              source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAClFBMVEUAAAA8w/87x/07yP46yP07xP87yP07yP47yP47yP47yf47yP4r1f89yP88yP47yP47yP8A//87yP87x/07yP47yP08x/8zzP88x/87yP46yP4+yf87yP46yP06yP87yP47yP46x/87yf47yP47y/87yP47yP46xf85xv87yP48yP87x/86yv87yP47yP44x/86x/86yP87yf46x/47yP07yf87yP07yP47yP47xP87yP47x/9Vqv8A//86x/87yP47yP47yf8+yP87yP47yP5Av/86x/86yP07yP08yP86yP47yP09zP87yP47yP46yf48x/07yf87yP47yf88yf85xv83yP88yf86yv85xv87yf86yP87yP47yP46yP07yP48x/07yP47yP48yf9Av/88yf05yf83yP88x/88yf87yP5Av/88yP47yP48yf87yf87yP47yP4+yv87yP46yf87x/88yP48yP07yP48yP06yf88y/87yP08yf07x/07yP4zzP83yP82yf87yP48yP46y/87x/88yP07yf47yP47yP46yP86yf85yv88zP89yP87x/06yP08yP87yP86yf87yP47yP46x/47yP46yv87yP07yP47yP48yf07yP88yP87yP06yf07yf8zzP87x/45xv88yP49wv9Ayv87yf07x/06yf08yP45xv88x/88yP07yf48yf9AzP86yP87yP88yP87yf48yP89x/87x/48yP86xf86yP07yP84x/85xv88yP46x/87x/47yf88yf87x/86yP87yP46x/87yv88x/87yP47x/47yP49yf88yP47x/9Jtv88x/85xv86yP07yP47x/9Az/87yf88yP87yP4AAAAI7L0dAAAA2nRSTlMAEY6qlRqYsMzk6v0GKtbxcAJFnP6oTQV89c0h6KZY1d5lsuAn5uIjG99rVjD79iByYbezj2iK1+0N9GQDAW2t8zQl6cQMYIOhXa+HGb3UwIBn7j1RNg4mNRJxRve7osKJ+etVBIRHHEBe2AjJ3S9j8vwdxnZS45H6nksilJag7AoXE8O0LFunztC5VEJDHi6TnWp5OcGsvLU+i+fvjUpmgohfD8ooqxUYpIV/8C1EmtxMFFNBPPh4O65zFpl+KTq4e+F6WVdPtmkrd9HTx1DSTgc3CZDZSRB1b/BxsPsAAAABYktHRACIBR1IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wkFDgorOgdtDwAABCJJREFUWMOdlvlfDGEcx7/JkXItqw0hObKlldwxlQ2VUs5IG0UlclSrRBGhHCEUYpErt9xCue/7PuavMTPPMdPuzOzsfn/Y18zn+X7eM/s8z/c7D0Db8GjnyUX7DuBudGSF6OQ2wAsBOrsN8EYAny4u+rp2694DQNezlx4B2N6+BtD59enbT6Pfn/P0HzCQlUTAoEDud7AmwpChrGIMC3LuH+7PqoTRwykgmFWNEKeAEaFqftNI5/8hTA0wSssshiv7R2vxG4yS1RsTPHbcePF+wkQNgAE0PWLSZF5gQiZQKVIDIIokR08hkjmGaFOdmKdNj40zkeR4Ue9JNL3XjIREFcBMyYQlMQoDySoAH0neLOnAbMnAHBWA4p6b6wZgnnRgvhwgZcHCVBXAIvm1pYA0fmnm2JWnRZKXLh1YLBkwImmJcOPXFpAhydPPF/WgTFFfugxpSegx0wCyssNzSOby3BVJJHMlrf28VURbvSYVDHOHc9LafKSEJsdzzaogTHxapLgThiCl0EqlbO554axlXVGxfZ2tp4DUfCqWbNi4oDStzCQKpQCbWPlYTgnrWcXYDDBJYah8C/Fv7awMMFaAVWGIVo5hG6sS23Wz5Af0OwigklWNHF0VvQ7dmb6rgNzsJoA96oBq2EueWcbX9b7NZGQ/BjCL1fw1AAfw5UFsOCTOUK0gTI7jb0oCS6RGnzqh0su4HhGAlMPklZkjNOsoUIJ/PZQeo5vleFlX2Gjj/TtOLMFaLV32kxSQhBXdqQahbZmxHiP01n6nzzApNpKbmUUBZynA26648/Dn/RxVztPcCDEti4oW+/5yHOmNVLggzspFGeole8BltNy+VNDRZZd8Ia4g4eqhXJ09AK5d56IQcuKaxoyUNAHh/5JXKM23WxbHSMykEzGi8cgNMuVm9Ay8rOwKWW8WX2M3+fECMu23+mCHqen2nZA40qsKUuX8d2Pu3W9+gDrl+IePWgJaOTFBfpMGGhz9zRFtUvgZzAB4rLDNHzoC5Cr7CfNUAdDOEVAlk5Zbr+CPKZSZ/qUOaY3Q7OjljySWWpAB4A/NVL/IFrzaCQDP+B0eOpjau1UyRc9tRXKL8EJIyHzJX19EzbCcW81XJtbyWledgc5zbxiQDyb4gbeQ0QPdV6BjyqW3efDuvdB+PsgXAIki/IY2clZvwMIGktEi3DYoAe7j/Doi3MTCRyKYP0YbP7VPUQK8wPlWInzGwhfQFqRTWc5igXyxojQC4GvNc+kOM6Mism5K1AoAmC5Y9NnfuOvv6ABrZLTbAX7gHurfv8mK+2OYK37wlR77UFS6BJD5Ttu0HLdpFDsC2H2uAHK5s8k9Uxv/T5f+AlT/8lqYGCuc9i1Rv+uL9eNcWgQSVaRmDH/csQP85QH/3PMK0eWZp2erQUvmf+fompH+RV0/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA5LTA1VDEyOjEwOjQzKzAyOjAwU34K1QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOS0wNVQxMjoxMDo0MyswMjowMCIjsmkAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'}}
              style={{
                width: 4 * vw,
                height: 4 * vw,
                alignSelf: 'center'
              }}
            />
                <Text style={styles.navItemStyle} onPress={() => {
                  const navigateAction = NavigationActions.navigate({
                        routeName: 'Admin'
                      });
                      this.props.navigation.dispatch(navigateAction);
                }}>
                  Manage
                </Text>
              </View>
            </View>
          <View>
          <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
          <Image
            source= {{uri: 'data:image/png;base64,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'}}
            style={{
              width: 4 * vw,
              height: 4 * vw,
              alignSelf: 'center'
            }}
          />
              <Text style={styles.navItemStyle} onPress={()=> {
                Linking.openURL('whatsapp://send?text=Hello%20Deepak%2C%20I%27m%20'+ this.state.name+ '&phone=919555579357')
              }}>
                Talk to Us
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 10 * vw}}>
            <Image
              source= {{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABRFBMVEUAAAA9yP86yP07yP47yP47yP47yP8zzP88yf87yP47yP48yf87yP46x/87yP47yP87yP4A//87yP46yf06yP87x/07yP45xv88yP05xv87yP46yP08yf46yP05xv87yP47yf87yP0A//87x/86yP07yP87yP88yP5Ayv87yP07yP47xP86y/87yP47yP47yv87yP46yv87yP46xf85xv87yP45yf87yP48yf87yf47yP07yf4+yP87x/86yf87x/9Av/89x/87xP87yP48yP5Av/86x/87yP87yP08yP07yP49wv86yP47yP48yP47yP47x/08x/87yP47yP06yf87yP49xv87yf87yf46yP87yP46x/83yP85xv87x/48yf87yP47yf07yf06yP86yP87yP46yP46xf87yP47yP07yP4AAACXQfyYAAAAanRSTlMALqbo+sN0D1r561X+bvxB0ALnf1iF8zqRNvuQxZ0oqnqhAVuifn3WGI/YGiz39ivZPtcWEu9H8SbOgvglUktOBDsNy8kMe3mop7EVr/TSxpw3x4Y5zz9s6lPBcg4bylGwqZJcT8zaH9+BXARh6gAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjCQUKEC79ScuHAAABvklEQVRYw+3W11LCQBQG4EVUpIggFgQVBLFQBXsH7Ii9K/Z+3v8BZIFAErLhLHvjOJ6r7M7/f5TNQAghhhZjK+iNsa3dRNjTYYbGY7Ey+wZMH8DWyQJaUH0AexcDMCIBcDi1AZtmuttlrU5Pb19pr18bYL1jt+wFBzx0y8UFAHhloUG6McQJ2IdrIR/d8HEC4BcFRkQB3y8FAsHRkEkEGCtejU8IABZQCSjATdeTsnw4wgdEYwDxhDxfE1AAiXq9CWW+KuAAjY8sCU0DMBURBCqCAFAWRICSgACSDjsrk5pGADOzoBdqDMzp9GEeASzYdIBFzHewxBaWk6hTWFmt/Uso+2tix2heF7sPSn0BoNxvHqj0kUA6k0kr81IfB2Q3ADa35PlqHwds0/WOLF/r44Bdut4rXcak8+cCZD/rOVWfG9jPHxwqHpd4Ad1b8x/428ARXR83D5x46DrEC5xKD9tn5Yftc15ANRdOMcB+qd0ncVzfdsXoEweqf33D6hN/47bx9q7A7JNsuPEx6s/9gyBAAo9PMS3gGQsUpxDM1RsvHAA1XtXGGx9QZ7w7uQGF8fHZTL9s5L9iqe8CMv4DWtKNeZYN6kMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDktMDVUMTA6MTY6NDYrMDA6MDDGDSj1AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA5LTA1VDEwOjE2OjQ2KzAwOjAwt1CQSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='}}
              style={{
                width: 4 * vw,
                height: 4 * vw,
                alignSelf: 'center'
              }}
            />
              <Text style={styles.navItemStyle} onPress={()=> {
                this.signOutUser()
              }}>
                Signout and Exit
              </Text>
            </View>
            </View>

        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={{color: 'white', fontSize: 1 * vh, textAlign: 'right'}}>Built with love by team ClassCast  </Text>
        </View>

      </View>
    );
  }
}



export default SideMenu;
