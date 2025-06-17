import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background: #f5f7fa;
  min-height: 100vh;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 100px 80px 0 80px;
  width: 100%;
  box-sizing: border-box;
`;

const Section = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #343c6a;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  margin-top: 8px;
  box-sizing: border-box;
  height: 46px;
  background: #f9f9f9;
  cursor: default;

  &:focus {
    outline: none;
    border-color: #ccc;
    box-shadow: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 10px;
`;

const DisplayBox = styled.div`
  width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background: #f9f9f9;
  color: #343c6a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  height: 46px;
  display: flex;
  align-items: center;
  cursor: default;
`;

const TaskCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const Label = styled.div`
  font-weight: 600;
  margin-top: 12px;
  color: #343c6a;
`;

export default function ProfessorTeamTaskDetail() {
  const { taskId } = useParams();
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([]);
  const [tasks, setTasks] = useState([{ title: "", detail: "" }]);
  const location = useLocation();

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/tasks/${taskId}`
          );
          const data = response.data;

          setTitle(data.title);
          setParticipants(data.participants || []);
          setTasks(
            data.details.map((detail) => ({
              id: detail.id,
              title: detail.title,
              detail: detail.content,
            }))
          );
        } catch (error) {
          console.error("과제 정보를 불러오는 데 실패했습니다:", error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const renderParticipantDisplay = () => {
    return participants.length === 0
      ? "참가자 없음"
      : participants.includes("ALL")
      ? "ALL"
      : participants.join(", ");
  };

  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle>과제 제출 및 조회</SectionTitle>
          <Input placeholder="과제 제목" value={title} readOnly />
          <Row>
            <DisplayBox>{renderParticipantDisplay()}</DisplayBox>
          </Row>
        </Section>

        <Section>
          <SectionTitle>과제 내용</SectionTitle>
          {tasks.map((task, idx) => (
            <TaskCard key={idx}>
              <Label>과제 {idx + 1} 제목</Label>
              <Input placeholder="과제 제목" value={task.title} readOnly />
              <Label>상세 항목</Label>
              <Input placeholder="상세 항목" value={task.detail} readOnly />
            </TaskCard>
          ))}
        </Section>
      </Content>
    </Container>
  );
}
