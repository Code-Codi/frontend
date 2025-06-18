import React, { useState, useRef, useEffect } from "react";
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
  grid-template-columns: 1fr 1fr;
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

const AddButton = styled.button`
  font-size: 16px;
  color: #1814f3;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-top: 20px;
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

const DeleteButton = styled(ActionButton)`
  background: white;
  color: red;
  border: 1px solid red;

  &:hover {
    background: red;
    color: white;
  }
`;

const DeleteIcon = styled.div`
  cursor: pointer;
  font-size: 35px;
  color: #888;

  &:hover {
    color: red;
  }
`;

export default function ProfessorTaskDetail() {
  const {taskGuideId } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([{ title: "", detail: "" }]);
  const [editing, setEditing] = useState(false);
  const location = useLocation();
  const isCreateMode = location.pathname === "/professor/taskCreate";
  const navigate = useNavigate();
  const [endDate, setEndDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (!taskGuideId && isCreateMode) {
      setEditing(true);
    }
    if (taskGuideId && location.pathname.includes("/taskDetail")) {
      setEditing(false);
    }
  }, [taskGuideId, location.pathname]);

  useEffect(() => {
    if (taskGuideId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/taskGuide/${taskGuideId}`
          );
          const data = response.data;

          setTitle(data.title);
          setEndDate(data.dueDate?.slice(0, 16));
          setCreatedAt(data.createAt);
          setTasks(
            data.details.map((detail) => ({
              id: detail.id,
              title: detail.title,
              detail: detail.description,
            }))
          );
        } catch (error) {
          console.error("과제 정보를 불러오는 데 실패했습니다:", error);
        }
      };
      fetchTask();
    }
  }, [taskGuideId]);

  const handleCreate = async () => {
    try {
      // 1. Task 생성
      const taskResponse = await axios.post("http://localhost:8080/taskGuide", {
        courseId: 2,
        title: title,
        dueDate: endDate,
      });

      const taskGuideId = taskResponse.data;

      // 2. 각 TaskDetail 등록
      for (const task of tasks) {
        await axios.post("http://localhost:8080/taskGuide-details", {
          taskGuideId: taskGuideId,
          title: task.title,
          description: task.detail,
        });
      }
      alert("과제가 성공적으로 등록되었습니다!");
      navigate(`/professor/taskDetail/${taskGuideId}`);
    } catch (error) {
      console.error("등록 중 오류:", error);
      alert("과제 등록에 실패했습니다.");
    }
  };

  const handleUpdate = async () => {
    try {
      // 1. Task 자체 수정
      await axios.patch(`http://localhost:8080/tasks/${taskGuideId}`, {
        title: title,
        status: "IN_PROGRESS",
        taskDate: new Date().toISOString().slice(0, 10),
      });

      // 2. TaskDetail 각각 수정
      for (const task of tasks) {
        if (task.id) {
          // 기존 항목 → 수정
          await axios.patch(`http://localhost:8080/task-details/${task.id}`, {
            title: task.title,
            content: task.detail,
          });
        } else {
          // 새 항목 → 생성
          await axios.post("http://localhost:8080/task-details", {
            taskGuideId: taskGuideId,
            title: task.title,
            content: task.detail,
          });
        }
      }

      alert("과제가 성공적으로 수정되었습니다!");
      setEditing(false);
    } catch (error) {
      console.error("수정 중 오류:", error);
      alert("과제 수정에 실패했습니다.");
    }
  };

  const handleDeleteTask = async () => {
    const confirm = window.confirm("정말 이 과제를 삭제하시겠습니까?");
    if (!confirm || !taskGuideId) return;
    try {
      await axios.delete(`http://localhost:8080/tasks/${taskGuideId}`);
      alert("과제가 삭제되었습니다.");
      navigate("/taskList"); // 삭제 후 목록으로 이동
    } catch (error) {
      console.error("과제 삭제 실패:", error);
      alert("과제 삭제에 실패했습니다.");
    }
  };

  const handleDeleteDetail = async (idx, detailId) => {
    const confirm = window.confirm("정말 이 과제 내용을 삭제하시겠습니까?");
    if (!confirm) return;
    try {
      if (detailId) {
        await axios.delete(`http://localhost:8080/task-details/${detailId}`);
      }
      const updated = [...tasks];
      updated.splice(idx, 1);
      setTasks(updated);
    } catch (error) {
      console.error("상세 과제 삭제 실패:", error);
      alert("과제 상세 내용 삭제에 실패했습니다.");
    }
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", detail: "" }]);
  };

  const handleTaskChange = (idx, key, value) => {
    const updated = [...tasks];
    updated[idx][key] = value;
    setTasks(updated);
  };

  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle>과제 조회</SectionTitle>
          <Input
            placeholder="과제 제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!editing}
          />
          <Row>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Label>마감일</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!editing}
              />
            </div>
          </Row>
        </Section>

        <Section>
          <SectionTitle>과제 내용</SectionTitle>
          {tasks.map((task, idx) => (
            <TaskCard key={idx}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Label>과제 {idx + 1} 제목</Label>
                {editing && (
                  <DeleteIcon onClick={() => handleDeleteDetail(idx, task.id)}>
                    🗑
                  </DeleteIcon>
                )}
              </div>
              <Input
                placeholder="과제 제목을 입력하세요."
                value={task.title}
                onChange={(e) => handleTaskChange(idx, "title", e.target.value)}
                disabled={!editing}
              />
              <Label>상세 항목</Label>
              <Input
                placeholder="상세 항목 입력"
                value={task.detail}
                onChange={(e) =>
                  handleTaskChange(idx, "detail", e.target.value)
                }
                disabled={!editing}
              />
            </TaskCard>
          ))}

          {editing && (
            <AddButton onClick={addTask}>＋ 과제 내용 추가</AddButton>
          )}
        </Section>

        <ButtonGroup>
          {isCreateMode ? (
            <ActionButton onClick={handleCreate}>등록</ActionButton>
          ) : !editing ? (
            <ActionButton onClick={() => setEditing(true)}>수정</ActionButton>
          ) : (
            <>
              <DeleteButton onClick={handleDeleteTask}>전체 삭제</DeleteButton>
              <ActionButton onClick={handleUpdate}>저장</ActionButton>
            </>
          )}
        </ButtonGroup>
      </Content>
    </Container>
  );
}
