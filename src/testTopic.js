import React, { Component } from 'react'
import {Dimensions, Image, Text, TouchableWithoutFeedback, View, ScrollView, TouchableNativeFeedback, BackHandler, StyleSheet} from 'react-native'
import axios from "axios";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const screen = Dimensions.get('window');
import {NavigationActions} from 'react-navigation';

class topic extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Select Topic',
    header: null
  })

   constructor() {
    super();
    this.nextPage = this.nextPage.bind(this);
    this.state = {
      isReady: false,
      topics: [],
      chapters: [],
      selectedChapter: false,
      blocks: [],
    }
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  nextPage() {
    const navigateAction = NavigationActions.navigate({
                routeName: 'sendTest',
                params: {
                  data: this.state.blocks
                }
              });
    this.props.navigation.dispatch(navigateAction);
  }

  handleBackButton() {
    this.props.navigation.navigate('createTest');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    data = {
      "standard": this.props.navigation.state.params.class,
      "exams_package": this.props.navigation.state.params.subject,
      "exam_name": this.props.navigation.state.params.goal
    }
    
    axios.post(`https://classcast-198812.appspot.com/teachersapp/get_topic_list`, data)
      .then(res => {
        console.log("snlnd: "+JSON.stringify(res.data));
        this.setState({
          isReady: true,
          chapters: res.data.map((chapter, index) => ({
            index: index,
            name: chapter.name,
            selected: false,
          }))
        })
      })
      .catch(e => {
        console.log("test_topic_list_error: "+JSON.stringify(e))
      })
    }


   render() {
    
    return (
      <View style={styles.container}>
        <View style={{marginLeft:0, marginTop: 0.04 * screen.height, marginBottom: 0.02 * screen.height}}>
            <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.07 * screen.width, color: '#7741cd'}}> Chapters </Text>
        </View>
        
        <View style={styles.topicListWrapper}>
          <ScrollView style={{width: '100%'}}>
            {
              this.state.chapters.map((chapter, index) => {
                return (
                  <TouchableNativeFeedback
                    onPress={() => {
                      let chapters = this.state.chapters;
                      chapters[index].selected = !chapters[index].selected;
                      this.setState({chapters});
                    }}
                    key={'TopicsList' + index}
                  >
                    <View style={styles.topicsListItem}>
                      <View style={styles.bullet}/>
                      <Text style={styles.topicsListItemText}>{chapter.name}</Text>
                      <View style={
                        chapter.selected
                          ? [styles.topicsListItemIconContainer, {backgroundColor: 'green'}]
                          : styles.topicsListItemIconContainer
                      }>
                        <Image
                          style={
                            topic.selected
                              ? styles.topicsListItemIcon
                              : {display: 'none'}
                          }
                          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO3YT6uMYQDG4YOFrJCTSBKJRDp1okgpSlGUIhYWko2Ftc9gZ8knsLdSylZSpFBSUjoJIUI4nMtiRnQ8M/7M+76Pcl/bmad+9zM17zRjYxERERERERERERHxb8JGXMZ1HK7d0ylM4IXvprGudlcnsAnP/exA7bbWYQOeFsY/waLafa3C+v7Q2V5ionZfq7AWU4XxrzBZu69VWIPHhfGvsbV2X6uwCo8K499gW+2+VmElHhbGv8WO2n2twgo8KIx/h521+4bCXExi9V+eX477hfHvsavp3kZhHq72g2dwHgv+4PxS3CuM/4A9bbY3ArsL8Xex+TfOjuNO4fxH7O2if2TYXhjw7RM8PeTcEtwunPuE/V1uGBkuDLgEuITxWe9fjJuF907jYK0dI8EJvcdVyZT+lxkW4saA8Ydq7xiJ3m/3WwMu4QvO4lrhtc84Wru/EZiPcwMuYdDFHKvd3Tjsw7NfjJ/B8dqtrcEyXBky/mTtxtZhDs7oPd5+dKp2W6ewBRf1/tA8UrsnIiIiIiIiIiIi4r/0FYagSGVUJK8oAAAAAElFTkSuQmCC'}}
                        />
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
              })
            }
          </ScrollView>
        </View>
        
        {
            <TouchableNativeFeedback
               onPress={() => {
                console.log("ankajssL: "+JSON.stringify(this.props.navigation.state.params));
                console.log("dsalkasnadsldL: "+JSON.stringify(this.state.chapters.filter(chapter => chapter.selected).map(chapter => chapter.name)));
                data = {
                        "standard": this.props.navigation.state.params.class,
                        "exams_package": this.props.navigation.state.params.subject,
                        "exam_name": this.props.navigation.state.params.goal,
                        "duration": this.props.navigation.state.params.duration,
                        "chapters": this.state.chapters.filter(chapter => chapter.selected).map(chapter => chapter.name),
                        "test_time": new Date()
                      }
                axios.post(`https://classcast-198812.appspot.com/teachersapp/get_chapterwise_test_data`, data)
                  .then(function (response){
                      console.log("abcd: "+JSON.stringify(response.data));
                      this.setState({blocks: response.data}, () => {
                        this.nextPage();
                    });
                      
                  }.bind(this))
                  .catch(function (error) {
                      console.log('error');
                  });
              }}
            >
              <View style={styles.nextButton}>
                <Text style={{fontFamily: 'Montserrat-SemiBold', fontSize: 0.04 * SCREEN_WIDTH, color: 'white'}}>Continue</Text>
              </View>
            </TouchableNativeFeedback>
          }
      </View>
    )
  }

}

export default topic

const styles = StyleSheet.create({
  
  container: {
    height: '100%',
    paddingTop: 0.05 * SCREEN_HEIGHT,
    backgroundColor: '#293046',
    alignItems: 'center',
  },
  topicListWrapper: {
    width: SCREEN_WIDTH,
    height: '80%'
  },
  topicsListItem: {
    flexDirection: 'row',
    height: 0.1 * SCREEN_HEIGHT,
    alignItems: 'center',
    paddingLeft: 0.025 * SCREEN_WIDTH,
  },
  topicsListItemText: {
    fontSize: 0.04 * SCREEN_WIDTH,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  topicsListItemIconContainer: {
    height: 0.03 * SCREEN_HEIGHT,
    width: 0.03 * SCREEN_HEIGHT,
    marginRight: 0.05 * SCREEN_WIDTH,
    marginLeft: 0.05 * SCREEN_WIDTH,
    borderRadius: 0.015 * SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  topicsListItemIcon: {
    height: 0.03 * SCREEN_HEIGHT,
    width: 0.03 * SCREEN_HEIGHT,
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
})