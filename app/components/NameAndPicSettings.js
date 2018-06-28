import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
  StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

const editButton = require('../../assets/images/edit.png');
const imageUrl = "https://s3.amazonaws.com/fitbots/no-profile-image.png";
const {width, height} = Dimensions.get("window");


class NameAndPicSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: "" ,
      image: this.props.image_url
    }

    this.saveHandler = this.saveHandler.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.imageDimension = this.imageDimension.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

    this.imageHeight = new Animated.Value(height/3.5);
    this.imageWidht = new Animated.Value(height/3.5);
    this.imageBorderRadius = new Animated.Value(height/7);

    this.imageFlex = new Animated.Value(2);
    this.buttonFlex = new Animated.Value(1);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide); 
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        toValue: height/6,
      }),
      Animated.timing(this.imageWidht, {
        toValue: height/6,
      }),
      Animated.timing(this.imageBorderRadius, {
        toValue: height/12,
      }),
      Animated.timing(this.imageFlex, {
        toValue: 1,
      }) ,
      Animated.timing(this.buttonFlex, {
        toValue: 2,
      })                  
    ]).start();    
  };

  keyboardDidHide() {
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        toValue: height/3.5,
      }),
      Animated.timing(this.imageWidht, {
        toValue: height/3.5,
      }),
      Animated.timing(this.imageBorderRadius, {
        toValue: height/7,
      }),
      Animated.timing(this.imageFlex, {
        toValue: 2,
      }) ,
      Animated.timing(this.buttonFlex, {
        toValue: 1,
      })           
    ]).start();  
  };

  imageDimension() {
    return ({
      height: this.imageHeight, 
      width: this.imageWidht, 
      borderRadius: this.imageBorderRadius
    })
  } 


  pickImage() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: false            
    }).then(image => {
      const base64Image = `data:${image.mime};base64,${image.data}`
      this.setState({ image: base64Image })
      this.uploadImage(base64Image)
    }).catch(err => {
      Sentry.captureException(err)
      throw err        
    });
  }

  saveHandler() {
    const { token } = this.props;
    const { image, name } = this.state;
    this.setState({ loading: true })
    HttpUtils.put('profile', { image_url: image, name }, token).then((response) => {
      this.setState({ loading: false, name:""})
      SessionStore.save({ imageUrl: imageUrl })
      Alert.alert("Yay! Update successful")
    }).catch((error) => {
      Alert.alert("Sorry! Upload failed.", error.message)
      this.setState({loading: false})      
    }).done()  
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {
          this.state.loading ? 
          <View style={styles.loadingConainer}>
            <ActivityIndicator size="large" style={styles.loading} color="black" />
          </View>
          :
          <View style={styles.mainContainer}>
            <Animated.View style={[styles.imageContainer, {flex: this.imageFlex}]}>
            <Animated.Image style={[styles.image, this.imageDimension() ]} source={{ uri: this.state.image }} />
            <TouchableHighlight style={styles.updateImageButton} onPress={this.pickImage} underlayColor='rgba(40, 87, 237, 0.70)' >
              <Image style={styles.updateImageButtonEdit} source={editButton} />
            </TouchableHighlight>            
          </Animated.View> 
          <View style={styles.nameContainer}>
            <Text style={styles.explanationText}>Update Name</Text>
            <TextInput
              style={styles.updateNameInput}
              value={this.state.name}
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={(name) => this.setState({ name })}    
            />          
          </View> 
          <Animated.View style={[styles.buttonContainer, {flex: this.buttonFlex}]}>
            <TouchableHighlight style={styles.saveButton} underlayColor='rgba(44,92,233,0.6)' onPress={this.saveHandler}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableHighlight>          
          </Animated.View>
          </View>
        }
        
    </View>       
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  loadingConainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center'
  },
  image: {
    borderWidth: 1,
    paddingTop: 5,
    borderColor: 'white', 
  },
  updateImageButton: {
    height: 60,
    width: 60,
    position: 'relative',
    bottom: 30,
    backgroundColor: 'rgba(233, 0, 90, 0.60)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },  
  },
  updateImageButtonEdit: {
    height: 60,
    width: 60,
    tintColor: 'white'
  },
  explanationText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 20,
    paddingLeft: 20,
    backgroundColor: 'transparent'
  },
  updateNameInput: {
    fontSize: 20,
    fontFamily: 'Avenir-Light',
    color: '#5B7182',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#CECFCF',
    height: 40,
    paddingLeft: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 0,
    backgroundColor: '#F4F4F4',
  },
  saveButton: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor:'#2C5CE9',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#F1F4FD',
    fontSize: 20,
    padding: 5    
  }    
})

export default NameAndPicSettings;