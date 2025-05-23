import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {useParams, useLocation, useNavigate} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: #f5f7fa;
  min-height: 100vh;
  padding: 100px 20px 50px 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 960px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #343C6A;
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
  color: #343C6A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  height: 46px;
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 160px;
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 10px 16px;
  font-size: 15px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? '#e6f0ff' : 'white')};

  &:hover {
    background: #f0f0f0;
  }
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
  color: #343C6A;
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
    padding: 4px;

    &:hover {
        color: red;
    }
`;

export default function TaskDetailForm() {
    const { taskId } = useParams();
    const [title, setTitle] = useState('');
    const [participants, setParticipants] = useState([]);
    const [tasks, setTasks] = useState([{ title: '', detail: '' }]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const participantOptions = ['ALL', '세미', '수현', '민경', '세령'];
    const location = useLocation();
    const isCreateMode = location.pathname === '/taskCreate';
    const navigate = useNavigate();

    useEffect(() => {
        if (!taskId && isCreateMode) {
            setEditing(true);
        }
        if (taskId && location.pathname.startsWith('/taskDetail')) {
            setEditing(false);
        }
    }, [taskId, location.pathname]);

    useEffect(() => {
        if (taskId) {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/tasks/${taskId}`);
                const data = response.data;

                setTitle(data.title);
                setTasks(
                    data.details.map((detail) => ({
                        id: detail.id,
                        title: detail.title,
                        detail: detail.content
                    }))
                );
            } catch (error) {
                console.error('과제 정보를 불러오는 데 실패했습니다:', error);
            }
        };
            fetchTask();
        }
    }, [taskId]);

    const handleCreate = async () => {
        try {
            // 1. Task 생성
            const taskResponse = await axios.post("http://localhost:8080/tasks", {
                teamId: 1,
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

    const handleDeleteTask = async () => {
        const confirm = window.confirm("정말 이 과제를 삭제하시겠습니까?");
        if (!confirm || !taskId) return;
        try {
            await axios.delete(`http://localhost:8080/tasks/${taskId}`);
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

    const handleToggleSelect = (value) => {
        if (value === 'ALL') {
            setParticipants(['ALL']);
        } else {
            setParticipants((prev) => {
                const exists = prev.includes(value);
                const filtered = prev.filter((p) => p !== 'ALL');
                return exists ? filtered.filter((p) => p !== value) : [...filtered, value];
            });
        }
    };

    const renderParticipantDisplay = () => {
        return participants.length === 0
            ? '참가자'
            : participants.includes('ALL')
                ? 'ALL'
                : participants.join(', ');
    };

    const addTask = () => {
        setTasks([...tasks, { title: '', detail: '' }]);
    };

    const handleTaskChange = (idx, key, value) => {
        const updated = [...tasks];
        updated[idx][key] = value;
        setTasks(updated);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Container>
            <Content>
                <Section>
                    <SectionTitle>과제 제출 및 조회</SectionTitle>
                    <Input placeholder="과제 제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editing} />
                    <Row>
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <DisplayBox onClick={() => setShowDropdown(!showDropdown)}>{renderParticipantDisplay()}</DisplayBox>
                            {showDropdown && (
                                <Dropdown>
                                    {participantOptions.map((name) => (
                                        <Option
                                            key={name}
                                            selected={participants.includes(name)}
                                            onClick={() => handleToggleSelect(name)}
                                        >
                                            {name}
                                        </Option>
                                    ))}
                                </Dropdown>
                            )}
                        </div>
                    </Row>
                </Section>

                <Section>
                    <SectionTitle>과제 내용</SectionTitle>
                    {tasks.map((task, idx) => (
                        <TaskCard key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Label>과제 {idx + 1} 제목</Label>
                                {editing && <DeleteIcon onClick={() => handleDeleteDetail(idx, task.id)}>🗑</DeleteIcon>}
                            </div>
                            <Input
                                placeholder="과제 제목을 입력하세요."
                                value={task.title}
                                onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                                disabled={!editing}
                            />
                            <Label>상세 항목</Label>
                            <Input
                                placeholder="상세 항목 입력"
                                value={task.detail}
                                onChange={(e) => handleTaskChange(idx, 'detail', e.target.value)}
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
                            <DeleteButton onClick={handleDeleteTask}>삭제</DeleteButton>
                            <ActionButton onClick={handleUpdate}>저장</ActionButton>

                        </>
                    )}
                </ButtonGroup>

            </Content>
        </Container>
    );
}
