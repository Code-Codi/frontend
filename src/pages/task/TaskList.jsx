import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import styled from "styled-components";
import TaskTable from '../../components/task/TaskTable';

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
  color: #343C6A;
  font-weight: bold;
  margin-bottom: 30px;
`;

export default function TaskList() {
    return (
        <Container>
            <Sidebar />
            <Content>
                <Header />
                <TaskTable />
            </Content>
        </Container>
    );
}
