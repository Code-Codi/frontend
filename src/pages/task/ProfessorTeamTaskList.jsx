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
  font-weight: 500;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 14px;
  color: #343c6a;
  padding: 10px;
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

const DropdownContainer = styled.div`
  position: relative;
  width: 140px;
  margin-bottom: 15px;
`;

const SelectedBox = styled.div`
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectedText = styled.span`
  font-size: 15px;
  color: #343c6a;
`;

const Arrow = styled.span`
  border: solid #343c6a;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;
  transform: ${({ open }) => (open ? "rotate(-135deg)" : "rotate(45deg)")};
  transition: transform 0.2s ease;
  margin-left: 8px;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  max-height: 160px;
  overflow-y: auto;
  z-index: 10;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const OptionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  background: ${({ selected }) => (selected ? "#1814f3" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#343c6a")};

  &:hover {
    background: #1814f3;
    color: white;
  }
`;

const formatDate = (dateStr) => {
  if (!dateStr) return "제출전";
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

export default function ProfessorTeamTaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);

  // 팀 목록 (실제 API 연동 시 바꿔주세요)
  const teamOptions = [
    { id: 1, name: "1팀" },
    { id: 2, name: "2팀" },
    { id: 3, name: "3팀" },
    { id: 4, name: "4팀" },
  ];

  // 초기값은 기본 첫 번째 팀
  const [selectedTeamId, setSelectedTeamId] = useState(teamOptions[0].id);

  const selectedTeam =
    teamOptions.find((team) => team.id === selectedTeamId) || teamOptions[0];

  const fetchTasks = async (pageNum = 0, teamIdParam = selectedTeamId) => {
    try {
      const res = await axios.get(`http://localhost:8080/tasks/teamTasks`, {
        params: {
          page: pageNum,
          size: 10,
          courseId: 1,
          teamId: 164,
          status: "COMPLETE",
        },
      });

      const result = res.data.result;
      setTasks(result.content || []);
      setPage(result.number);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("과제 리스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchTasks(0, selectedTeamId);
  }, [selectedTeamId]);

  const goToDetail = (taskId) => {
    navigate(`/professor/team/taskDetail/${taskId}`);
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const selectTeam = (team) => {
    if (team.id === selectedTeamId) {
      setOpen(false);
      return;
    }
    setSelectedTeamId(team.id);
    localStorage.setItem("teamId", team.id);
    setPage(0);
    setOpen(false);
  };

  return (
    <Container>
      <Content>
        <>
          <HeaderRow>
            <h2
              style={{ fontSize: "20px", color: "#343C6A", fontWeight: "bold" }}
            >
              과제 리스트
            </h2>
          </HeaderRow>

          <DropdownContainer>
            <SelectedBox
              onClick={toggleDropdown}
              role="button"
              aria-expanded={open}
            >
              <SelectedText>{selectedTeam.name}</SelectedText>
              <Arrow open={open} />
            </SelectedBox>
            {open && (
              <OptionsList>
                {teamOptions.map((team) => (
                  <OptionItem
                    key={team.id}
                    selected={team.id === selectedTeamId}
                    onClick={() => selectTeam(team)}
                  >
                    {team.name}
                  </OptionItem>
                ))}
              </OptionsList>
            )}
          </DropdownContainer>

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
                <TableRow key={task.taskId} onClick={() => goToDetail(task.taskId)}>
                  <Td>{page * 10 + idx + 1}</Td>
                  <Td>{formatDate(task.taskDate)}</Td>
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
              <PageButton
                key={i}
                active={i === page}
                onClick={() => fetchTasks(i, selectedTeamId)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        </>
      </Content>
    </Container>
  );
}
