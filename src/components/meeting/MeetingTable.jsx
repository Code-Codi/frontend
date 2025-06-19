import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const Td = styled.td`
  font-size: 15px;
  color: #343c6a;
  padding: 17px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
`;

const TableRow = styled.tr`
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

export default function MeetingTable() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");

  const [meetings, setMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMeetings = async (pageNum = 0) => {
    if (!teamId) {
      console.warn("teamId가 없습니다. 로그인 또는 팀 선택 후 이용하세요.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/meeting?teamId=${teamId}&page=${pageNum}&size=10`
      );
      setMeetings(res.data.result.content);
      setPage(res.data.result.number);
      setTotalPages(res.data.result.totalPages);
    } catch (error) {
      console.error("회의록 리스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMeetings(0);
  }, [teamId]);

  const goToDetail = (id) => {
    navigate(`/meetingDetail/${id}`);
  };

  const handleCreateMeeting = () => {
    navigate(`/meetingCreate`);
  };

  return (
    <>
      <HeaderRow>
        <h2 style={{ fontSize: "22px", color: "#343C6A", fontWeight: "bold" }}>
          회의록 리스트
        </h2>
        <PlusButton onClick={handleCreateMeeting}>＋</PlusButton>
      </HeaderRow>

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
          {meetings.map((item, idx) => {
            return (
              <TableRow key={item.id} onClick={() => goToDetail(item.id)}>
                <Td>{page * 10 + idx + 1}</Td>
                <Td>{item.dateTime?.split("T")[0]}</Td>
                <Td>{item.title}</Td>
                <Td>
                  {item.attendees && item.attendees.length > 0
                      ? item.attendees.join(", ")
                      : "-"}
                </Td>
                <Td>{item.location}</Td>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i}
            active={i === page}
            onClick={() => fetchMeetings(i)}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>
    </>
  );
}
