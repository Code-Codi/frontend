import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 100px 80px 0 80px;
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

export default function ProfessorTaskList() {
  const navigate = useNavigate();
  //const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState();

  const tasks = [
    {
      id: 1,
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      title: "1차 과제",
    },
    {
      id: 2,
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      title: "2차 과제",
    },
    {
      id: 3,
      startDate: "2025-07-20",
      endDate: "2025-08-05",
      title: "3차 과제",
    },
    {
      id: 4,
      startDate: "2025-08-10",
      endDate: "2025-08-25",
      title: "4차 과제",
    },
    {
      id: 5,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
    {
      id: 6,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
    {
      id: 7,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
    {
      id: 8,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
    {
      id: 9,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
    {
      id: 10,
      startDate: "2025-09-01",
      endDate: "2025-09-15",
      title: "5차 과제",
    },
  ];

  const goToDetail = (taskId) => {
    navigate(`/professor/taskDetail/${taskId}`);
  };

  const fetchTasks = async (pageNum = 0) => {
    // try {
    //   const res = await axios.get(
    //     http://localhost:8080/tasks?teamId=${teamId}&page=${pageNum}&size=10
    //   );
    //   setTasks(res.data.content);
    //   setPage(res.data.number);
    //   setTotalPages(res.data.totalPages);
    // } catch (error) {
    //   console.error("과제 리스트 조회 실패:", error);
    // }
  };

  const handleCreateTask = () => {
    navigate(`/professor/taskCreate`); //임시설정
  };

  return (
    <Container>
      <Content>
        <HeaderRow>
          <h2
            style={{ fontSize: "20px", color: "#343C6A", fontWeight: "bold" }}
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
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <TableRow key={task.id} onClick={() => goToDetail(task.id)}>
                <Td>{page * 10 + idx + 1}</Td>
                <Td>
                  {task.startDate} ~{task.endDate}
                </Td>
                <Td>{task.title}</Td>
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
