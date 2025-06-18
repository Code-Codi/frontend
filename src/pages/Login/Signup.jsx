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
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("STUDENT");

  // 각 필드별 에러 메시지 저장
  const [errors, setErrors] = useState({});

  const handleSignup = async () => {
    setErrors({}); // 초기화

    if (!name) {
      alert("이름을 입력하세요.");
      return;
    }
    if (!birth) {
      alert("생년월일을 입력하세요.");
      return;
    }
    if (!email) {
      alert("이메일 입력하세요.");
      return;
    }
    if (!pw) {
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

      // 서버가 보낸 필드별 에러 메시지 추출
      if (err.response?.data?.result) {
        setErrors(err.response.data.result);
      } else {
        alert(err.response?.data?.message || "회원가입에 실패하였습니다.");
      }
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
          errorMessage={errors.username} // 이름 필드 에러 출력 (DTO 필드명에 맞게 username 혹은 name 조정)
        />
        {errors.username && (
          <p style={{ color: "red", marginTop: "4px" }}>{errors.username}</p>
        )}

        <InputField
          label="생년월일"
          name="birth"
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          errorMessage={errors.birthDate}
        />
        {errors.birthDate && (
          <p style={{ color: "red", marginTop: "4px" }}>{errors.birthDate}</p>
        )}

        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          errorMessage={errors.email}
        />
        {errors.email && (
          <p style={{ color: "red", marginTop: "4px" }}>{errors.email}</p>
        )}

        <InputField
          label="Password"
          name="password"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          errorMessage={errors.password}
        />
        {errors.password && (
          <p style={{ color: "red", marginTop: "4px" }}>{errors.password}</p>
        )}

        <SubmitButton onClick={handleSignup}>가입하기</SubmitButton>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          이미 계정이 있으신가요? <a href="/login">로그인하기</a>
        </p>
      </AuthCard>
    </AuthWrapper>
  );
};

export default Signup;
