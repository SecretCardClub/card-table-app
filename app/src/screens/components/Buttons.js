import styled, { css, keyframes } from 'styled-components/native'
import { BORDER_RADIUS } from './constants'
import { P } from './Text'
import { Text } from 'react-native'


export const Button = ({ title, children, textColor, color, ...buttonProps }) => {
  return (
    <ButtonView {...buttonProps} >
      <P textColor={textColor} color={color} >{title}</P>
    </ButtonView>
  )
}


export const ButtonView = styled.TouchableOpacity`
  display: flex;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  justify-content: center;
  border-radius: ${BORDER_RADIUS};
  width: ${(({ width }) => width ? `${width}` : 'auto' )};
  height: ${(({ height }) =>  height ? `${height}` : 'auto')};
  border-width: ${(({ borderWidth }) => borderWidth || `0px`)};
  border-color: ${(({ borderColor }) => borderColor || `rgb(230, 230, 230)`)};
  background-color: ${(({ backgroundColor }) => backgroundColor || `rgb(230, 230, 230)`)};
`