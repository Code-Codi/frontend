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
  margin-top: 10px;
`;

const DisplayBox = styled.div`
  width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background: white;
  cursor: pointer;
  color: #343c6a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  height: 46px;
  display: flex;
  align-items: center;
  background: ${({ disabled }) => (disabled ? "#f5f5f5" : "white")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const TaskCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const Label = styled.div`
  margin-top: 12px;
  font-size: 20px;
  color: #343c6a;
  font-weight: bold;
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

const CancelButton = styled(ActionButton)`
  background: white;
  color: red;
  border: 1px solid red;

  &:hover {
    background: red;
    color: white;
  }
`;

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextarea = styled.textarea`
  height: 100px;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  margin-top: 8px;

  &:disabled {
    background: #f5f5f5;
    color: #888;
  }
`;

const FileLabel = styled.label`
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  background: #0f0cc0;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  align-self: flex-start;

  &:hover {
    background: #0056b3;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #444;
`;

export default function TaskDetailForm() {
  const teamId = localStorage.getItem("teamId");

  const { taskId } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([{ title: "", detail: "" }]);
  const [editing, setEditing] = useState(false);
  const location = useLocation();
  const isCreateMode = location.pathname === "/taskCreate";
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId && isCreateMode) {
      setEditing(true);
    }
    if (taskId && location.pathname.startsWith("/taskDetail")) {
      setEditing(false);
    }
  }, [taskId, location.pathname]);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/tasks/${taskId}`
          );
          const data = response.data;

          setTitle(data.title);
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

  const handleCreate = async () => {
    try {
      // 1. Task 생성
      const taskResponse = await axios.post("http://localhost:8080/tasks", {
        teamId: parseInt(teamId),
        title: title,
        status: "IN_PROGRESS",
        taskDate: new Date().toISOString().slice(0, 10), // yyyy-MM-dd 형식
      });

      const taskId = taskResponse.data;

      // 2. 각 TaskDetail 등록
      for (const task of tasks) {
        await axios.post("http://localhost:8080/task-details", {
          taskId: taskId,
          title: task.title,
          content: task.detail,
        });
      }
      alert("과제가 성공적으로 등록되었습니다!");
      navigate(`/taskDetail/${taskId}`);
    } catch (error) {
      console.error("등록 중 오류:", error);
      alert("과제 등록에 실패했습니다.");
    }
  };

  const handleUpdate = async () => {
    try {
      // 1. Task 자체 수정
      await axios.patch(`http://localhost:8080/tasks/${taskId}`, {
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
            taskId: taskId,
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

  const handleTaskChange = (idx, field, value) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[idx] = { ...newTasks[idx], [field]: value };
      return newTasks;
    });
  };

  const handleFileChange = (idx, file) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[idx] = { ...newTasks[idx], file };
      return newTasks;
    });
  };

  const formatFileSize = (size) => {
    return (size / 1024).toFixed(1) + " KB";
  };

  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle disabled>과제 제출 및 조회</SectionTitle>
          <Input value={title} disabled />
          <Row>
            <div>
              <Label>기간</Label>
              <DisplayBox disabled>
                2025.06.08 오후 11:59 ~ 2025.06.30 오후 11:59
              </DisplayBox>
            </div>
          </Row>
          <Row>
            <div>
              <Label>팀명</Label>
              <DisplayBox disabled>팀명</DisplayBox>
            </div>
            <div>
              <Label>제출 날짜</Label>
              <DisplayBox disabled>2025.04.29 오전 9:20:49</DisplayBox>
            </div>
          </Row>
        </Section>

        <Section>
          <Label>과제 내용</Label>
          {tasks.map((task, idx) => (
            <TaskCard key={idx}>
              <Input value={task.title} disabled />
              <Input value={task.detail} disabled />
              <TextareaWrapper key={idx}>
                <StyledTextarea
                  placeholder="과제 내용 입력"
                  value={task.detail}
                  onChange={(e) =>
                    handleTaskChange(idx, "detail", e.target.value)
                  }
                  disabled={!editing}
                />
                {editing ? (
                  <>
                    {task.file && (
                      <FileInfo>
                        선택된 파일: {task.file.name} (
                        {formatFileSize(task.file.size)})
                      </FileInfo>
                    )}
                    <FileLabel htmlFor={`file-${idx}`}>파일 선택</FileLabel>
                    <FileInput
                      id={`file-${idx}`}
                      type="file"
                      onChange={(e) =>
                        handleFileChange(idx, e.target.files?.[0])
                      }
                    />
                  </>
                ) : (
                  task.file && (
                    <FileInfo>
                      첨부파일:{" "}
                      <a href={task.fileUrl} target="_blank" rel="noreferrer">
                        {task.fileName}
                      </a>
                    </FileInfo>
                  )
                )}
              </TextareaWrapper>
            </TaskCard>
          ))}
        </Section>

        <ButtonGroup>
          {isCreateMode ? (
            <ActionButton onClick={handleCreate}>등록</ActionButton>
          ) : !editing ? (
            <ActionButton onClick={() => setEditing(true)}>수정</ActionButton>
          ) : (
            <>
              <CancelButton onClick={() => setEditing(false)}>
                취소
              </CancelButton>
              <ActionButton onClick={handleUpdate}>제출</ActionButton>
            </>
          )}
        </ButtonGroup>
      </Content>
    </Container>
  );
}
