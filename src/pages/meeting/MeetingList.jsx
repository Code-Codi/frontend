import MeetingTable from "../../components/meeting/MeetingTable";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 110px 80px 0 80px;
  width: 100%;
  background: #f5f7fa;
`;

export default function MeetingList() {
  return (
    <Container>
      <Content>
        <MeetingTable />
      </Content>
    </Container>
  );
}
