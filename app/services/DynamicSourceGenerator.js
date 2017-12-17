// Have to be hardcorded because: https://github.com/facebook/react-native/issues/2481
const ICONS = {
  universal: {
    nextWorkoutArrow: require('../../assets/images/nextWorkoutArrow.png'),
    gradientButtSlap: require('../../assets/images/gradientButtSlap.png'),
  },
  dark: {
    basketball:    require('../../assets/images/dark/basketball.png'),
    running:       require('../../assets/images/dark/running.png'),
    yoga:          require('../../assets/images/dark/yoga.png'),
    cycling:       require('../../assets/images/dark/cycling.png'),
    spin_class:    require('../../assets/images/dark/spin_class.png'),
    hot_yoga:      require('../../assets/images/dark/hot_yoga.png'),
    weightlifting: require('../../assets/images/dark/weightlifting.png'),
  },
  light: {
    basketball:    require('../../assets/images/light/basketball.png'),
    running:       require('../../assets/images/light/running.png'),
    yoga:          require('../../assets/images/light/yoga.png'),
    cycling:       require('../../assets/images/light/cycling.png'),
    spin_class:    require('../../assets/images/light/spin_class.png'),
    hot_yoga:      require('../../assets/images/light/hot_yoga.png'),
    weightlifting: require('../../assets/images/light/weightlifting.png'),
  }
}

export const DynamicSourceGenerator = {
  call: (source) => {
    if (source.filename) {
      if (source.shade) {
        return ICONS[source.shade][source.filename] || ICONS[source.shade][source.fallback]
      } else {
        return ICONS.universal[source.filename]
      }
    } else {
      return source
    }
  }
}