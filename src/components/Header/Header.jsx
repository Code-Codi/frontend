import styled from 'styled-components';
import { ReactComponent as AccountSVG } from '../../assets/account.svg';

const HeaderWrapper = styled.div`
  height: 90px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 2px solid #E6EFF5;
  background-color: white;
  z-index: 1000;
`;

const AccountIcon = styled(AccountSVG)`
  width: 30px;
  height: 30px;
  position: absolute;
  fill: #718EBF;
  cursor: pointer;
  top: 25px;
  right: 40px; 
`;

const Logo = styled.div`
  position: absolute;
  width: 138px;
  left: 83px;
  top: 25px;
  color: #343C6A;
  font-size: 25px;
  font-weight: bold;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <AccountIcon />
      <Logo>CODI</Logo>
    </HeaderWrapper>
  );
}
