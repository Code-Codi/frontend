import styled from "styled-components";
import TaskTable from "../../components/task/TaskTable";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 248px;
  padding: 100px 80px 0 80px;
  width: 100%;
  background: #f5f7fa;
`;

export default function TaskList() {
  return (
    <Container>
      <Content>
        <TaskTable />
      </Content>
    </Container>
  );
}
