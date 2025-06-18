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
  padding: 100px 80px 0 80px;
  width: 100%;
  box-sizing: border-box;
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
  font-size: 22px;
  color: #343c6a;
  font-weight: bold;
  margin-top: 10px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background: #1814f3;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0f0cc0;
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
  const [editing, setEditing] = useState(false);

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


  const handleContentChange = (idx, value) => {
    const updated = [...tasks];
    updated[idx].content = value;
    setTasks(updated);
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log("💬 저장 요청 직전 tasks 상태:", tasks);

      const payload = {
        details: tasks.map((task) => ({
          taskDetailId: task.taskDetailId,
          content: task.content,
        })),
      };

      await axios.patch(`http://localhost:8080/tasks/final/${taskId}`, payload);
      alert("저장되었습니다.");
      setEditing(false);
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류 발생");
    }
  };

  return (
      <Container>
        <Content>
          <Section>
            <SectionTitle>과제 조회</SectionTitle>
            <Input value={title} readOnly />
            <Row>
              <div>
                <Label>팀명</Label>
                <Input value={teamName} readOnly/>
              </div>
              <div>
                <Label>제출일</Label>
                <Input value={taskDate ? formatDate(taskDate) : "제출 전"} readOnly />
              </div>
              <div>
                <Label>제출 기한</Label>
                <Input
                    value={`${formatDate(createdAt)} ~ ${formatDate(dueDate)}`}
                    readOnly
                />
              </div>
            </Row>

          </Section>

          <Section>
            <SectionTitle>세부 과제 및 답변</SectionTitle>
            {tasks.map((task, idx) => (
                <TaskCard key={idx}>
                  <Label>과제 {idx + 1} 제목</Label>
                  <Input value={task.title} readOnly />
                  <Label>과제 설명</Label>
                  <Input value={task.detail} readOnly />
                  <Label>과제 답변</Label>
                  <Input
                      value={task.content}
                      onChange={(e) => handleContentChange(idx, e.target.value)}
                      readOnly={!editing}
                  />
                </TaskCard>
            ))}
          </Section>

          <ButtonGroup>
            {!editing ? (
                <ActionButton onClick={handleEditToggle}>작성 및 수정</ActionButton>
            ) : (
                <ActionButton onClick={handleSave}>저장</ActionButton>
            )}
          </ButtonGroup>
        </Content>
      </Container>
  );
}
