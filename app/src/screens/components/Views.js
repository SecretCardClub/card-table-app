import styled, { css, keyframes } from 'styled-components/native'
import { BORDER_RADIUS } from './constants'
import { Text } from './Text'


export const ScreenView = styled.View`
  width: ${(({ width }) =>  width || '100%')};
  height: ${(({ height }) =>  height || '100%')};

  display: flex;
  align-items: center;
  justify-content: center;
`


export const UserView = ({ name, color }) => {
  return (
    <UserContainer color={color} >
      <UserText>{name}</UserText>
    </UserContainer>
  )
}

const UserContainer = styled.TouchableOpacity`
  width: auto;
  height: auto;
  display: flex;
  padding: 10px;
  color: 'white';
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: ${(({ color }) =>  color || 'grey')};
`

const UserText = styled(Text)`
  color: white;
`

