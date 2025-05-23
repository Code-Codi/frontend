import React from "react";
import styled from "styled-components";

const FieldWrapper = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
`;

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "off",
}) => {
  return (
    <FieldWrapper>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </FieldWrapper>
  );
};

export default InputField;
