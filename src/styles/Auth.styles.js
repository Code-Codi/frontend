import styled from "styled-components";

export const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
`;

export const AuthCard = styled.div`
  background: white;
  padding: 48px 36px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #888;
  text-align: center;
  margin-bottom: 24px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #3478f6;
  color: white;
  padding: 14px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-top: 12px;
  font-size: 16px;

  &:hover {
    background-color: #1d62d6;
  }
`;
