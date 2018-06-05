import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

//Guideline sizes are based on standard ~5" screen mobile device
//iPhone 6 width 375
//iPhone 6 height 680
const guidelineBaseWidth = 350
const guidelineBaseHeight = 680

const scale = size => width / guidelineBaseWidth * size
const scaleVertical = size => height / guidelineBaseHeight * size
const scaleModerate = (size, factor = 0.5) => size + ( scale(size) - size ) * factor

export {scale, scaleVertical, scaleModerate}
