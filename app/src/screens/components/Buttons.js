import styled, { css, keyframes } from 'styled-components/native'
import { BORDER_RADIUS } from './constants'

export const Button = styled.TouchableOpacity`
  width: 60%;
  height: 17%;
  display: flex;
  border-radius: ${BORDER_RADIUS};
  max-height: 50px;
  align-items: center;
  justify-content: center;
  background-color: rgb(225, 225, 225);
`