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
  color: #8a8a8a;
  font-weight: 500;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 15px;
  color: #343c6a;
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
  padding: 2px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: ${({ submitted }) => (submitted ? "#fff" : "#fff")};
  color: ${({ submitted }) => (submitted ? "#1814f3" : "#000")};
  cursor: pointer;
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

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

export default function TaskTable() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const teamId = localStorage.getItem("teamId");
  const fetchTasks = async (pageNum = 0) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/tasks?teamId=${teamId}&page=${pageNum}&size=10`
      );
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

  const goToDetail = (taskId) => {
    navigate(`/taskDetail/${taskId}`);
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "IN_PROGRESS" ? "제출 완료" : "제출 전";
    const confirm = window.confirm(`"${nextStatus}" 상태로 바꾸시겠습니까?`);
    if (!confirm) return;

    try {
      await axios.patch(`http://localhost:8080/tasks/${task.taskId}/status`);
      alert(`상태가 "${nextStatus}"로 변경되었습니다.`);
      fetchTasks(page); // 변경 후 최신 리스트 다시 불러오기
    } catch (err) {
      console.error("상태 변경 실패:", err);
      alert("상태 변경 중 오류 발생");
    }
  };

  return (
    <>
      <HeaderRow>
        <h2 style={{ fontSize: "22px", color: "#343C6A", fontWeight: "bold" }}>
          과제 리스트
        </h2>
      </HeaderRow>

      <Table>
        <thead>
          <tr>
            <Th>No</Th>
            <Th>제출 기한</Th>
            <Th>제목</Th>
            <Th>상태</Th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <TableRow key={task.taskId} onClick={() => goToDetail(task.taskId)}>
              <Td>{page * 10 + idx + 1}</Td>
              <Td>{`${formatDate(task.createAt)} ~ ${formatDate(
                task.dueDate
              )}`}</Td>
              <Td>{task.title}</Td>
              <Td>
                <SubmitButton
                  submitted={task.status === "COMPLETE"}
                  onClick={(e) => {
                    e.stopPropagation(); // 행 클릭 방지
                    handleToggleStatus(task);
                  }}
                >
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
