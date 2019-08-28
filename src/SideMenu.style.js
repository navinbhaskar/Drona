import {Dimensions, StyleSheet} from 'react-native';

const screen = Dimensions.get('window'),
 vh = screen.height / 100,
 vw = screen.width / 100;

export default {
 container: {
   paddingTop: 2.5 * vh,
   flex: 1,
   backgroundColor: '#f0f3fa'
 },
 navItemStyle: {
   padding: 2 * vh,
   paddingHorizontal: 8 * vw,
   color: '#211482',
   fontSize: 3.5 * vw,
   fontFamily: 'Montserrat-SemiBold',
 },
 imageModal: {
    height: 30 * vh,
    width: 70 * vw,
    display: 'flex',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#73009e',
    marginLeft: 10 * vw,
    marginTop: 20 * vh,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
 navSectionStyle: {
   backgroundColor: '#262f46'
 },
 sectionHeadingStyle: {
   paddingVertical: 1.25 * vh,
   paddingHorizontal: 4 * vw,
   marginTop: 1.25 * vh,
   backgroundColor: 'white',
   fontWeight: 'bold'
 },
 footerContainer: {
   padding: 0.4 * vh,
   backgroundColor: '#1d136b'
 },
  userImage: {
   height: '100%',
   width: '100%',
   alignSelf: 'center',
   borderRadius: 15 * vw,
 },
 userImageContainer: {
  height: 30 * vw,
  width: 30 * vw,
  borderRadius: 15 * vw,
  padding: 0.6 * vw,
  backgroundColor: '#29206f'
 },
  userName: {
   fontSize: 3 * vh,
   margin: 1 * vh,
   color: '#211482',
   fontFamily: 'Montserrat-SemiBold',
 },
 class: {
  fontSize: 2 * vh,
  color: '#211482',
  marginLeft: 1 * vh,
  marginTop: 0.5 * vh,
  marginBottom: 0.5 * vh,
  fontFamily: 'Montserrat-SemiBold',
},
 aboutUserSection:{
   marginTop: 2 * vh,
   marginLeft: 5 * vw,
   backgroundCOlor: 'red'
 },
 tncModal: {
   height: 80 * vh,
   width: 90 * vw,
   backgroundColor: 'white',
   borderRadius: 1.5 * vw,
   paddingTop: 5 * vh,
   paddingLeft: 7.5 * vw,
   paddingRight: 7.5 * vw,
   paddingBottom: 1 * vh,
 },
 tncHeadingBig: {
   fontSize: 6 * vw,
   color: 'black',
   fontFamily: 'Montserrat-Bold',
   marginBottom: 2 * vh,
 },
 tncText: {
   color: 'black',
   fontSize: 3.5 * vw,
   marginBottom: 2 * vh,
 },
 tncTextListItem: {
   color: 'black',
   fontSize: 3.5 * vw,
   marginBottom: 2 * vh,
   marginLeft: 2 * vw,
 },
 tncHeadingSmall: {
   fontSize: 4.5 * vw,
   fontFamily: 'Montserrat-SemiBold',
   color: 'black',
   marginBottom: 2 * vh,
 },
 contactInfo: {
   fontSize: 3.5 * vw,
   color: 'black',
   fontFamily: 'Montserrat-Bold'
 },
 tncButtonContainer: {
   width: '100%',
   alignItems: 'flex-end',
 },
 tncButton: {
   fontSize: 4.5 * vw,
   fontFamily: 'Montserrat-Bold',
   color: '#754faf',
   marginTop: 2 * vh,
 },
 button: {
    paddingTop: 2 * vh,
    paddingBottom: 2 * vh,
    paddingLeft: 5 * vw,
    paddingRight: 5 * vw,
    marginLeft: vw,
    marginRight: vw,
    borderRadius: 10,
    backgroundColor: '#73009e',
    marginTop: vh,
    marginBottom: vh,
    width: 40 * vw,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
  buttonclose: {
    paddingTop: 2 * vh,
    paddingBottom: 2 * vh,
    paddingLeft: 5 * vw,
    paddingRight: 5 * vw,
    marginLeft: 25 * vw,
    marginRight: vw,
    borderRadius: 20,
    backgroundColor: '#df0000',
    marginTop: vh,
    marginBottom: vh,
    width: 40 * vw,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: 3.5 * vh,
    height: 3.5 * vh,
    marginLeft: 30 * vw,
    marginTop: -1.5 * vh,
  }
}