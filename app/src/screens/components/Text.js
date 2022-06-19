import styled, { css, keyframes } from 'styled-components/native'
import { BORDER_RADIUS } from './constants'

export const Text = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(({ textColor, color }) => textColor || color || 'rgb(25, 25, 25)')};
`;

export const H1 = styled(Text)`
  font-size: 40px;
`
export const H2 = styled(Text)`
  font-size: 35px;
`
export const H3 = styled(Text)`
  font-size: 30px;
`

export const P = styled(Text)`
  font-size: 18px;
  font-weight: 500;
`;
