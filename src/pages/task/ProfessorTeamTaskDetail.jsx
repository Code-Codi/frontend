import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background: #f5f7fa;
  min-height: 100vh;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 110px 80px 0 80px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
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
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  color: #343c6a;
  font-weight: bold;
  margin-top: 10px;
`;

const TaskCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const Label = styled.div`
  font-weight: 600;
  margin-top: 12px;
  font-size: 20px;
  color: #343c6a;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-top: 15px;
  color: #343c6a;

  &:first-of-type {
    margin-top: 0;
  }
`;

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

export default function ProfessorTaskDetail() {
  const { taskId } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/tasks/final/${taskId}`
          );
          const data = response.data.result;

          setTitle(data.title);
          setTeamName(data.teamName);
          setTaskDate(data.taskDate);
          setDueDate(data.dueDate?.slice(0, 16));
          setCreatedAt(data.createAt?.slice(0, 16));

          setTasks(
            data.details.map((d) => ({
              taskDetailId: d.taskDetailId,
              title: d.title,
              detail: d.description,
              content: d.content,
            }))
          );
        } catch (error) {
          console.error("과제 정보를 불러오는 데 실패했습니다:", error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle>과제 조회</SectionTitle>
          <Input value={title} disabled />
          <Row>
            <div>
              <Label>팀명</Label>
              <Input value={teamName} disabled />
            </div>
            <div>
              <Label>제출일</Label>
              <Input
                value={taskDate ? formatDate(taskDate) : "제출 전"}
                disabled
              />
            </div>
            <div>
              <Label>제출 기한</Label>
              <Input
                value={`${formatDate(createdAt)} ~ ${formatDate(dueDate)}`}
                disabled
              />
            </div>
          </Row>
        </Section>

        <Section>
          <SectionTitle>세부 과제 및 답변</SectionTitle>
          {tasks.map((task, idx) => (
            <TaskCard key={idx}>
              <DetailLabel>과제 {idx + 1} 제목</DetailLabel>
              <Input value={task.title} disabled />
              <DetailLabel>과제 설명</DetailLabel>
              <Input value={task.detail} disabled />
              <DetailLabel>과제 답변</DetailLabel>
              <Input value={task.content} disabled />
            </TaskCard>
          ))}
        </Section>
      </Content>
    </Container>
  );
}
