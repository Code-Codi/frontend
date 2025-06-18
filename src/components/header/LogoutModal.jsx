import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  border: 0.7px solid #b1b1b1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 35px;
  box-sizing: border-box;
  width: 600px;
`;

const Title = styled.div`
  color: #343c6a;
  font-size: 25px;
  font-weight: 600;
  margin: 14px 0 60px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 6px 0;
  border-radius: 10px;
  border: 1px solid #b1b1b1;
  font-size: 22px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background: white;
  color: #343c6a;
`;

const LogoutButton = styled(Button)`
  background: #1814f3;
  color: white;
`;

const DeleteButton = styled(Button)`
  background: #5CAFEE;
  color: white;
`;

export const LogoutModal = ({ onClose }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );

      localStorage.clear();
      onClose();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    onClose();
    navigate("/delete");
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>로그아웃/탈퇴 하시겠습니까?</Title>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          <DeleteButton onClick={handleDelete}>계정탈퇴</DeleteButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};
