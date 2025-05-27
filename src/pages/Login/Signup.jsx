import React, { useState } from "react";
import {
  AuthWrapper, AuthCard, Title, SubmitButton
} from "../../styles/Auth.styles";
import InputField from "../../components/Login/InputField";
import api from "../../api/login/login";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
  try {
    const res = await api.signup({
      username: name,
      birthDate: birth,
      email,
      password: pw,
    });

    console.log("회원가입 성공 응답:", res);
    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
    navigate("/login");
  } catch (err) {
    console.error("회원가입 실패 원인:", err.response?.data || err.message);
    alert("회원가입 실패");
  }
};


  return (
    <AuthWrapper>
      <AuthCard>
        <Title>회원가입</Title>

        <InputField
          label="이름"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />

        <InputField
          label="생년월일"
          name="birth"
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
        />

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

        <SubmitButton onClick={handleSignup}>가입하기</SubmitButton>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          이미 계정이 있으신가요? <a href="/login">로그인하기</a>
        </p>
      </AuthCard>
    </AuthWrapper>
  );
};

export default Signup;
