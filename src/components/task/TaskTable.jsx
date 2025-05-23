import styled from "styled-components";
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

const dummyTasks = [
    { no: "01.", date: "2025.03.30", title: "1주 과제", submitted: true },
    { no: "02.", date: "2025.03.30", title: "2주 과제", submitted: false },
    { no: "03.", date: "2025.03.30", title: "2주 과제", submitted: false },
    { no: "04.", date: "2025.03.30", title: "2주 과제", submitted: false },
];

export default function TaskTable() {
    const navigate = useNavigate();

    const handleSubmit = (task) => {
        if (!task.submitted) {
            const confirm = window.confirm("과제를 제출하시겠습니까?");
            if (confirm) {
                alert("제출되었습니다 (실제 제출 로직 필요)");
            }
        }
    };

    const goToDetail = () => {
        navigate("/taskDetail");
    };

    return (
        <>
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
                {dummyTasks.map((task, idx) => (
                    <TableRow key={idx} onClick={goToDetail}>
                        <Td>{task.no}</Td>
                        <Td>{task.date}</Td>
                        <Td>{task.title}</Td>
                        <Td>
                            <SubmitButton
                                submitted={task.submitted}
                                onClick={() => handleSubmit(task)}
                            >
                                {task.submitted ? "제출완료" : "제출전"}
                            </SubmitButton>
                        </Td>
                    </TableRow>
                ))}
                </tbody>
            </Table>
            <PlusButton onClick={goToDetail}>＋</PlusButton>
        </>
    );
}
