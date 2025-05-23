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
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 15px;
  color: #343C6A;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
`;

const TableRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
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

const dummyData = [
    { no: "01.", date: "2025.3.30", title: "프로젝트 킥오프 회의", members: "ALL", place: "비대면" },
    { no: "02.", date: "2025.4.30", title: "프론트엔드 개발 계획 수립", members: "ALL", place: "비대면" },
    { no: "03.", date: "2025.5.30", title: "디자인 시안 검토", members: "ALL", place: "비대면" },
    { no: "04.", date: "2025.6.30", title: "백엔드 API 명세 정리", members: "ALL", place: "비대면" },
    { no: "05.", date: "2025.7.30", title: "1차 개발 점검 회의", members: "ALL", place: "비대면" },
    { no: "06.", date: "2025.8.30", title: "DB 모델링 리뷰", members: "ALL", place: "비대면" },
    { no: "07.", date: "2025.9.30", title: "기획 변경사항 공유", members: "ALL", place: "비대면" },
    { no: "08.", date: "2025.10.30", title: "2차 테스트 및 QA 피드백", members: "ALL", place: "비대면" },
];

export default function MeetingTable() {
    const navigate = useNavigate();

    const goToDetail = () => {
        navigate("/meetingDetail");
    };

    const handleCreateMeeting = () => {
        navigate("/meetingCreate");
    };

    return (
        <>
            <Table>
                <thead>
                <tr>
                    <Th>No</Th>
                    <Th>날짜</Th>
                    <Th>제목</Th>
                    <Th>참가자</Th>
                    <Th>장소</Th>
                </tr>
                </thead>
                <tbody>
                {dummyData.map((item, idx) => (
                    <TableRow key={idx} onClick={goToDetail}>
                        <Td>{item.no}</Td>
                        <Td>{item.date}</Td>
                        <Td>{item.title}</Td>
                        <Td>{item.members}</Td>
                        <Td>{item.place}</Td>
                    </TableRow>
                ))}
                </tbody>
            </Table>
            <PlusButton onClick={handleCreateMeeting}>＋</PlusButton>
        </>
    );
}
