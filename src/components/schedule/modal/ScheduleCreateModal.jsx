import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createSchedule,
  updateSchedule,
} from "../../../api/schedule/scheduleAPI";

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

const ScheduleCreateModal = ({
  selectedDate,
  onClose,
  mode = "create",
  schedule,
}) => {
  const [teamId, setTeamId] = useState(1); // 임시 설정ㅇ
  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [startLocalDateTime, setStartLocalDateTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("00:00");
  const [endLocalDateTime, setEndLocalDateTime] = useState("");

  const [content, setContent] = useState("");

  const formatLocalDateTimeToDateString = (localDateTime) => {
    if (!localDateTime || !localDateTime._date) return "";

    const year = localDateTime._date._year;
    const month = String(localDateTime._date._month).padStart(2, "0");
    const day = String(localDateTime._date._day).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (mode === "edit" && schedule) {
      setTitle(schedule.title || "");

      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      setStartDate(start.toISOString().slice(0, 10));
      setStartTime(start.toISOString().slice(11, 16));
      setStartLocalDateTime(schedule.startDate);
      setEndDate(end.toISOString().slice(0, 10));
      setEndTime(end.toISOString().slice(11, 16));
      setEndLocalDateTime(schedule.endDate);
      setContent(schedule.content || "");
      setTeamId(schedule.teamId || 1);
    } else if (mode === "create" && selectedDate) {
      const formattedDate = formatLocalDateTimeToDateString(selectedDate);
      setStartDate(formattedDate);
      setEndDate(formattedDate);
      if (formattedDate) {
        setStartLocalDateTime(`${formattedDate}T${startTime}:00`);
        setEndLocalDateTime(`${formattedDate}T${endTime}:00`);
      }
    }
  }, [mode, schedule, selectedDate]);

  const combineDateTime = (date, time) => {
    return date && time ? `${date}T${time}:00` : "";
  };

  const handleDateTimeChange = (date, time, setDateTime, label) => {
    const combined = combineDateTime(date, time);
    setDateTime(combined);
  };

  const onStartDateChange = (e) => {
    const newDate = e.target.value;
    setStartDate(newDate);
    handleDateTimeChange(newDate, startTime, setStartLocalDateTime, "Start");
  };

  const onStartTimeChange = (e) => {
    const newTime = e.target.value;
    setStartTime(newTime);
    handleDateTimeChange(startDate, newTime, setStartLocalDateTime, "Start");
  };

  const onEndDateChange = (e) => {
    const newDate = e.target.value;
    setEndDate(newDate);
    handleDateTimeChange(newDate, endTime, setEndLocalDateTime, "End");
  };

  const onEndTimeChange = (e) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    handleDateTimeChange(endDate, newTime, setEndLocalDateTime, "End");
  };

  const handleSubmit = async () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }

    const scheduleData = {
      teamId: teamId, // 임시 설정
      title: title,
      startDate: startLocalDateTime,
      endDate: endLocalDateTime,
      content: content,
    };

    try {
      if (mode === "create") {
        await createSchedule(scheduleData);
      } else if (mode === "edit") {
        await updateSchedule(schedule.id, scheduleData);
      }
      onClose();
    } catch (error) {
      console.error("스케줄 등록 실패:", error);
    }
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <Title>일정 등록</Title>

        <FieldContainer>
          <Label>
            제목 <span>*</span>
          </Label>
          <InputBox
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </FieldContainer>

        <FieldContainer>
          <Label>
            기간 <span>*</span>
          </Label>
          <PeriodContainer>
            <TimeBox>
              <label>시작</label>
              <TimeInput
                type="date"
                value={startDate}
                onChange={onStartDateChange}
              />
              <TimeInput
                type="time"
                value={startTime}
                onChange={onStartTimeChange}
              />
            </TimeBox>
            <TimeBox>
              <label>종료</label>
              <TimeInput
                type="date"
                value={endDate}
                onChange={onEndDateChange}
              />
              <TimeInput
                type="time"
                value={endTime}
                onChange={onEndTimeChange}
              />
            </TimeBox>
          </PeriodContainer>
        </FieldContainer>

        <MemoContainer>
          <Label>메모</Label>
          <MemoInputContainer>
            <MemoBox
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="메모를 입력하세요"
            />
          </MemoInputContainer>
        </MemoContainer>

        <SubmitContainer>
          <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
        </SubmitContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ScheduleCreateModal;
