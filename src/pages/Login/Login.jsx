import React, { useState } from "react";
import {
  AuthWrapper, AuthCard, Title, Subtitle, SubmitButton
} from "../../styles/Auth.styles";
import InputField from "../../components/Login/InputField";
import api from "../../api/login/login";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const response = await api.login({
      email,
      password: pw,
    });

    // 응답 구조: { isSuccess, code, message, result }
    if (response.isSuccess) {
      const username = response.result.username;
      localStorage.setItem("username", username);

      alert("로그인 성공!");
      navigate("/share"); // 원하는 경로로 이동
    } else {
      alert(`로그인 실패: ${response.message}`);
    }

  } catch (err) {
    console.error("로그인 요청 에러:", err);
    alert("로그인 실패");
  }
};



  return (
    <AuthWrapper>
      <AuthCard>
        <Title>로그인</Title>
        <Subtitle>계정을 입력해 주세요</Subtitle>

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

        <SubmitButton onClick={handleLogin}>로그인</SubmitButton>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          계정이 없으신가요? <a href="/signup">회원가입하기</a>
        </p>
      </AuthCard>
    </AuthWrapper>
  );
};

export default Login;
