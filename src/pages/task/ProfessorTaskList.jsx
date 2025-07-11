import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 110px 80px 0 80px;
  width: 100%;
  background: #f5f7fa;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-size: 14px;
  color: #8a8a8a;
  font-weight: 600;
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 14px;
  color: #343c6a;
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
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
  padding: 8px 14px;
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

const PlusButton = styled.div`
  text-align: center;
  font-size: 26px;
  margin-top: 25px;
  cursor: pointer;

  &:hover {
    color: #1814f3;
  }
`;

const NotifyButton = styled.button`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  background: ${({ disabled }) => (disabled ? "#ddd" : "#fff")};
  color: ${({ disabled }) => (disabled ? "#888" : "#1814f3")};
  border: 1px solid #ccc;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;
`;

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

export default function ProfessorTaskList() {
  const navigate = useNavigate();
  const [taskGuides, setTaskGuides] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const courseId = localStorage.getItem("courseId");

  const goToDetail = (taskGuideId) => {
    navigate(`/professor/taskDetail/${taskGuideId}`);
  };

  const fetchTasks = async (pageNum = 0) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/taskGuide?courseId=${courseId}&page=${pageNum}&size=10`
      );
      setTaskGuides(res.data.content);
      setPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("과제 리스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchTasks(0);
  }, []);

  const handleCreateTask = () => {
    navigate(`/professor/taskCreate`);
  };

  const handleNotify = async (e, taskGuideId) => {
    e.stopPropagation(); // row 클릭 막기
    const confirmSend = window.confirm(
      "해당 과제를 학생 팀에게 공지하시겠습니까?"
    );
    if (!confirmSend) return;

    try {
      await axios.post(
        `http://localhost:8080/taskGuide/${taskGuideId}/generateTasks`
      );
      alert("과제가 성공적으로 학생들에게 공지되었습니다.");
      fetchTasks(page);
    } catch (error) {
      console.error("과제 공지 실패:", error);
      alert("공지 중 오류가 발생했습니다.");
    }
  };
  return (
    <Container>
      <Content>
        <HeaderRow>
          <h2
            style={{ fontSize: "22px", color: "#343C6A", fontWeight: "bold" }}
          >
            과제 리스트
          </h2>
          <PlusButton onClick={handleCreateTask}>＋</PlusButton>
        </HeaderRow>

        <Table>
          <thead>
            <tr>
              <Th>No</Th>
              <Th>기간</Th>
              <Th>제목</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {taskGuides.map((task, idx) => (
              <TableRow key={task.id} onClick={() => goToDetail(task.id)}>
                <Td>{page * 10 + idx + 1}</Td>
                <Td>
                  {formatDate(task.createAt)} ~ {formatDate(task.dueDate)}
                </Td>
                <Td>{task.title}</Td>
                <Td>
                  <NotifyButton
                      disabled={task.status === "COMPLETED"}
                    onClick={(e) => handleNotify(e, task.id)}
                  >
                    {task.status === "COMPLETED" ? "공지 완료" : "공지"}
                  </NotifyButton>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i}
              active={i === page}
              onClick={() => fetchTasks(i)}
            >
              {i + 1}
            </PageButton>
          ))}
        </Pagination>
      </Content>
    </Container>
  );
}
