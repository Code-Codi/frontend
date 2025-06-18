import React, { useState } from "react";
import {
  AuthWrapper,
  AuthCard,
  Title,
  Subtitle,
  SubmitButton,
} from "../../styles/Auth.styles";
import InputField from "../../components/Login/InputField";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/login/login";

const Delete = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await api.deleteAccount({
        email,
        password: pw,
      });

      if (response.isSuccess) {
        alert("계정이 삭제되었습니다.");
        localStorage.clear(); // 로그인 정보 초기화
        navigate("/login");
      } else {
        alert(`실패: ${response.message}`);
      }
    } catch (err) {
      console.error("계정 삭제 요청 에러:", err);
      alert("계정 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <Title>계정 탈퇴</Title>
        <Subtitle>정말로 계정을 삭제하시겠습니까?</Subtitle>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />

        <SubmitButton onClick={handleDelete} style={{ backgroundColor: "#1814f3" }}>
          계정 삭제
        </SubmitButton>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <a href="/login">로그인으로 돌아가기</a>
        </p>
      </AuthCard>
    </AuthWrapper>
  );
};

export default Delete;
