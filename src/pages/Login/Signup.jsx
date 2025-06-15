import React, { useState } from "react";
import {
  AuthWrapper,
  AuthCard,
  Title,
  SubmitButton,
} from "../../styles/Auth.styles";
import InputField from "../../components/Login/InputField";
import * as api from "../../api/login/login";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState(null);
  const [birth, setBirth] = useState(null);
  const [email, setEmail] = useState(null);
  const [pw, setPw] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState("STUDENT");

  const handleSignup = async () => {
    if (name == null) {
      alert("이름을 입력하세요.");
      return;
    }
    if (birth == null) {
      alert("생년월일을 입력하세요.");
      return;
    }
    if (email == null) {
      alert("이메일 입력하세요.");
      return;
    }
    if (pw == null) {
      alert("비밀번호를 입력하세요.");
      return;
    }
    try {
      const res = await api.signup({
        username: name,
        birthDate: birth,
        email,
        password: pw,
        role,
      });
      console.log("회원가입 성공 응답:", res);
      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패 원인:", err.response?.data || err.message);
      alert(err.response?.data?.message || "회원가입에 실패하였습니다.");
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <Title>회원가입</Title>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ fontWeight: "500", display: "block", marginBottom: "8px" }}
          >
            역할 선택
          </label>
          <label style={{ marginRight: "16px" }}>
            <input
              type="radio"
              value="STUDENT"
              checked={role === "STUDENT"}
              onChange={(e) => setRole(e.target.value)}
              style={{ marginRight: "6px" }}
            />
            학생
          </label>
          <label>
            <input
              type="radio"
              value="PROFESSOR"
              checked={role === "PROFESSOR"}
              onChange={(e) => setRole(e.target.value)}
              style={{ marginRight: "6px" }}
            />
            교수
          </label>
        </div>

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
