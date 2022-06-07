import styled, { css, keyframes } from 'styled-components/native'
import { BORDER_RADIUS } from './constants'



export const Input = styled.TextInput`
  width: 70%;
  height: 17%;
  max-height: 50px;
  padding-left: 2%;
  border-radius: ${BORDER_RADIUS};
  background-color: rgb(230, 230, 230);
`