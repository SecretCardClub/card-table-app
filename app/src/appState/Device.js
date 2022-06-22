import { Dimensions, Platform } from "react-native";

const heightDivisor = Platform.OS === 'ios' ? 1 : 2;


const Dims = Dimensions.get('screen');

Dimensions.addEventListener('change', (dimObject) => {
  const { screen } = dimObject
  console.log(`Dim change event `, screen, Dims)
  Dims.height = screen.height
  Dims.width = screen.width
  Dims.scale = screen.scale
})
const { height, width, scale } = Dims

Dims.pixelHeight = height * scale;
Dims.pixelWidth = width * scale;

Dims.percentToPixels =  (percent, dimension = 'width', integer = true) => {
  const maxPixelsForDim = dimension === 'width' ? Dims.pixelWidth : Dims.pixelHeight = height * scale;
  if(integer) {
    return Math.round(maxPixelsForDim * percent)
  }
  return maxPixelsForDim * percent
}

Dims.heightPercentToPixels = (percent, integer = true) => {
  return Dims.percentToPixels(percent, 'height', integer)
}
Dims.widthPercentToPixels = (percent, integer = true) => {
  return Dims.percentToPixels(percent, 'width', integer)
}

Dims.calcPosition = (x_per, y_per, offset = false) => {
  if(!y_per) {
    y_per = x_per.y_per
    x_per = x_per.x_per
  }

  const widthDiv = Dims.width / 2;
  // const heightDiv = Dims.height / 2;

  const heightDiv = Dims.height / heightDivisor;

  let x, y;
  if(offset) {
    x = Dims.width * x_per - widthDiv - 50;
    y = Dims.height * y_per - 70;
  }
  else {
    x = Dims.width * x_per - widthDiv - 5;
    y = Dims.height * y_per - 7
  }

  if ( x > widthDiv ) {
    x = widthDiv
  }
  if ( (0 - widthDiv) > x ) {
    x = (0 - widthDiv)
  }

  if ( y > heightDiv ) {
    y = heightDiv
  }
  if ( (0 - heightDiv) > y ) {
    y = (0 - heightDiv)
  }
  // console.log({ x_per, y_per, x, y })
  // console.log('\n', { x_per, x, width })
  // console.log({ y_per, y, height })
  return { x, y }
}


export default {
  OS: Platform.OS,
  Dims
}