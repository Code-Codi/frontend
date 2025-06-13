import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-size: 15px;
  color: #8A8A8A;
  font-weight: 500;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 15px;
  color: #343C6A;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 6px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: ${({ submitted }) => (submitted ? "#fff" : "#fff")};
  color: ${({ submitted }) => (submitted ? "#1814f3" : "#000")};
  cursor: ${({ submitted }) => (submitted ? "default" : "pointer")};
`;

const PlusButton = styled.div`
  text-align: center;
  font-size: 26px;
  margin-top: 25px;
  cursor: pointer;

  &:hover {
    color: #1814f3;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background: ${({ active }) => (active ? "#1814f3" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: 1px solid #ccc;
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1814f3;
    color: white;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export default function TaskTable() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const teamId = localStorage.getItem("teamId");
    const fetchTasks = async (pageNum = 0) => {
        try {
            const res = await axios.get(`http://localhost:8080/tasks?teamId=${teamId}&page=${pageNum}&size=10`);
            setTasks(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("과제 리스트 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchTasks(0);
    }, [teamId]);

    const handleSubmit = (task) => {
        if (window.confirm("과제를 제출하시겠습니까?")) {
            alert("제출되었습니다 (로직 구현 필요)");
        }
    };

    const goToDetail = (taskId) => {
        navigate(`/taskDetail/${taskId}`);
    };

    const handleCreateTask = () => {
        navigate(`/taskCreate`);
    };

    return (
        <>
            <HeaderRow>
                <h2 style={{ fontSize: "20px", color: "#343C6A", fontWeight: "bold" }}>과제 리스트</h2>
                <PlusButton onClick={handleCreateTask}>＋</PlusButton>
            </HeaderRow>

            <Table>
                <thead>
                <tr>
                    <Th>No</Th>
                    <Th>날짜</Th>
                    <Th>제목</Th>
                    <Th>상태</Th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task, idx) => (
                    <TableRow key={task.id} onClick={() => goToDetail(task.id)}>
                        <Td>{page * 10 + idx + 1}</Td>
                        <Td>{task.taskDate}</Td>
                        <Td>{task.title}</Td>
                        <Td>
                            <SubmitButton submitted={task.status === "COMPLETE"}>
                                {task.status === "COMPLETE" ? "제출완료" : "제출전"}
                            </SubmitButton>
                        </Td>
                    </TableRow>
                ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: totalPages }, (_, i) => (
                    <PageButton key={i} active={i === page} onClick={() => fetchTasks(i)}>
                        {i + 1}
                    </PageButton>
                ))}
            </Pagination>
        </>
    );
}
