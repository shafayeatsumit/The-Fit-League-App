import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-crop-picker';
import { Sentry } from 'react-native-sentry'

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const addButton = require('../../assets/images/addButton.png')
const blankImageUrl = "https://s3.amazonaws.com/fitbots/no-profile-image.png"

export default class ProfileImage extends Component {
  constructor(props) {
    super(props);
    this.state = { image: blankImageUrl, loading: false }

    this.navigate = this.navigate.bind(this);
    this.openImage = this.pickAnImage.bind(this);    
    this.uploadImage = this.uploadImage.bind(this);    
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
  } 

  uploadImage = (image) => {
    const { token } = this.props
    HttpUtils.post('images', {image:  image}, token).then((imagesResponse) => {
      let { url:imageUrl } = imagesResponse.data.attributes
      HttpUtils.put('profile', {image_url: imageUrl }, token).then((profileResponse) => {
        SessionStore.save({ imageUrl: imageUrl })
        this.setState({loading:false})
        Actions.home({ token })
      }).catch((error) => {
        Alert.alert("Sorry! Upload failed.", error.message)      
      }).done();
    }).catch((error) => {
      Alert.alert("Sorry! Upload failed.", error.message)      
    }).done();          
  }

  pickAnImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: false            
    }).then(image => {
      const base64Image = `data:${image.mime};base64,${image.data}`
      this.setState({
        image: base64Image,
        loading: true
      })
      this.uploadImage(base64Image)
    }).catch(err => {
      Sentry.captureException(err)
      throw err        
    });
  }

  navigate = () => {
    const { token } = this.props
    Actions.home({ token })
  }

  render() {
    return (
      <LinearGradient 
        start={{x: 0, y: 1}} end={{x: 1, y: 0}}
        colors={['#2857ED', '#1DD65B']}
        style={styles.contentContainer}>
        <View style={styles.textHolder}>
          <Text style={styles.text}>
            Add a profile pic
          </Text>
        </View>
        <View style={styles.imageUploader}>          
          <Image style={styles.image} source={{ uri: this.state.image}} />
          <TouchableHighlight style={styles.addImageButton}  underlayColor='rgba(40, 87, 237, 0.70)' onPress={this.pickAnImage}>
            <Image style={styles.addImageButtonPlus} source={addButton} />
          </TouchableHighlight>                      
        </View>
        { this.state.loading ?
          <View style={styles.skipTextHolder}>
            <Text style={styles.skipText}>Uploading Image ...</Text>          
          </View>
          :
          <View style={styles.skipTextHolder}>
            <TouchableHighlight underlayColor='rgba(40, 87, 237, 0.70)' onPress={this.navigate}>
              <Text style={styles.skipText}>Skip This Step</Text>
            </TouchableHighlight>
          </View>                  
        }
      </LinearGradient>              
    )
  } 
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  textHolder:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'    
  },
  imageUploader: {
    flex:3,
    justifyContent:'center',
    alignItems: 'center'
  },
  skipTextHolder: {
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'    
  },
  text: {
    fontSize: 30,
    fontFamily: 'Avenir-Black',
    color: 'white',
    fontWeight: '700',
    backgroundColor: 'transparent',
    textAlign: 'center'
  }, 
  skipText: {
    fontSize: 18,
    fontFamily: 'Avenir-Light',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center' ,
    marginBottom: 15   
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'white',
  },
  addImageButton: {
    height: 70,
    width: 70,
    position: 'absolute',
    bottom: SCREEN_HEIGHT/4 - 120,
    //left: SCREEN_WIDTH/2,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },  
  },
  addImageButtonPlus: {
    height: 37,
    width: 37
  }
})