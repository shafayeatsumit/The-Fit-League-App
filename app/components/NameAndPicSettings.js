import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  TextInput,
  Keyboard,
  Animated,
  StyleSheet
} from 'react-native';

const editButton = require('../../assets/images/edit.png');
const imageUrl = "https://s3.amazonaws.com/fitbots/no-profile-image.png";
const {width, height} = Dimensions.get("window");


class NameAndPicSettings extends Component {
  constructor(props) {
    super(props);
    this.imageHeight = new Animated.Value(height/3);
    this.imageWidht = new Animated.Value(height/3);
    this.imageBorderRadius = new Animated.Value(height/6);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide); 
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        toValue: height/5,
      }),
      Animated.timing(this.imageWidht, {
        toValue: height/5,
      }),
      Animated.timing(this.imageBorderRadius, {
        toValue: height/10,
      })      
    ]).start();    
  };

  keyboardDidHide = () => {
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        toValue: height/3,
      }),
      Animated.timing(this.imageWidht, {
        toValue: height/3,
      }),
      Animated.timing(this.imageBorderRadius, {
        toValue: height/6,
      })      
    ]).start();  
  };

  imageDimension = () => ({
    height: this.imageHeight, 
    width: this.imageWidht, 
    borderRadius: this.imageBorderRadius
  })

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Animated.Image style={[styles.image, this.imageDimension() ]} source={{ uri: imageUrl}} />
          <TouchableHighlight style={styles.updateImageButton}  underlayColor='rgba(40, 87, 237, 0.70)' >
            <Image style={styles.updateImageButtonEdit} source={editButton} />
          </TouchableHighlight>            
        </View> 
        <View style={styles.nameContainer}>
          <Text style={styles.explanationText}>Update Name</Text>
          <TextInput
            style={styles.updateNameInput}
            value="ZAC BARRET"
          />          
        </View>   
      </View>      
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  imageContainer: {
    flex:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  image: {
    borderWidth: 1,
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
  }  
})

export default NameAndPicSettings;