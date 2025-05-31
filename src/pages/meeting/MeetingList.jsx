import MeetingTable from "../../components/meeting/MeetingTable";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 100px 80px 0 80px;
  width: 100%;
  background: #f5f7fa;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #343c6a;
  font-weight: bold;
  margin-bottom: 30px;
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
