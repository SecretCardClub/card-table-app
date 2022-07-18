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

Dims.calcPosition = (x_per, y_per, offset = true) => {
  if(!y_per) {
    y_per = x_per.y_per
    x_per = x_per.x_per
  }

  let x, y;
  if(offset) {
    x = Dims.width * x_per  - 50;
    y = Dims.height * y_per - 70;
  }
  else {
    x = Dims.width * x_per - 5;
    y = Dims.height * y_per - 7

  }

  return { x, y }
}


export default {
  OS: Platform.OS,
  Dims
}