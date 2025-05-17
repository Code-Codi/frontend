import styled from "styled-components";

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
  border-radius: 10px;
  border: 0.5px solid #b1b1b1;
  background: white;
  padding: 25px 25px 18px 25px;
  max-width: 500px;
  width: 100%;
  z-index: 1000;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #343c6a;
  margin-bottom: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  width: 471px;
  gap: 10px;
  margin-bottom: 13px;
  border-bottom: 1px solid #b1b1b1;
  padding-bottom: 10px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  font-size: 18px;
  color: #343c6a;
  font-weight: 400;
  min-width: 60px;

  & > span {
    color: #ff0004;
    margin-left: 4px;
  }
`;

const InputBox = styled.input`
  flex: 1;
  height: 45px;
  border: 0.4px solid #b1b1b1;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 16px;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TimeBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  label {
    color: #343c6a;
  }
`;

const TimeInput = styled.input`
  width: 120px;
  height: 34px;
  border: 0.4px solid #b1b1b1;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 16px;
`;

const MemoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const MemoInputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MemoBox = styled.textarea`
  height: 130px;
  width: 380px;
  border: 0.4px solid #b1b1b1;
  border-radius: 10px;
  padding: 10px;
  resize: none;
  font-size: 16px;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
`;

const SubmitButton = styled.button`
  font-size: 18px;
  color: #343c6a;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;

  &:hover {
    color: #1e2a47;
  }
`;

const ScheduleCreateModal = ({ onClose }) => {
  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <Title>일정 등록</Title>

        <FieldContainer>
          <Label>
            제목 <span>*</span>
          </Label>
          <InputBox placeholder="제목을 입력하세요" />
        </FieldContainer>

        <FieldContainer>
          <Label>
            기간 <span>*</span>
          </Label>
          <PeriodContainer>
            <TimeBox>
              <label>시작</label>
              <TimeInput type="date" />
              <TimeInput type="time" />
            </TimeBox>
            <TimeBox>
              <label>종료</label>
              <TimeInput type="date" />
              <TimeInput type="time" />
            </TimeBox>
          </PeriodContainer>
        </FieldContainer>

        <MemoContainer>
          <Label>메모</Label>
          <MemoInputContainer>
            <MemoBox placeholder="메모를 입력하세요" />
          </MemoInputContainer>
        </MemoContainer>

        <SubmitContainer>
          <SubmitButton onClick={onClose}>등록</SubmitButton>
        </SubmitContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ScheduleCreateModal;
