import React, { useState } from 'react';
import styled from 'styled-components';
import AgendaSection from '../../components/meeting/AgendaSection';
import DecisionSection from '../../components/meeting/DecisionSection';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: #f5f7fa;
  min-height: 100vh;
  padding: 100px 20px 50px 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 960px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #343C6A;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  margin-top: 8px;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;

  & > input {
    flex: 1;
    min-width: 200px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: #1814f3;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0f0cc0;
  }
`;

export default function MeetingDetailForm() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [participants, setParticipants] = useState('');
    const [location, setLocation] = useState('');

    const [agendas, setAgendas] = useState([{ title: '', details: [''] }]);
    const [decisions, setDecisions] = useState(['']);

    return (
        <Container>
            <Content>
                <Section>
                    <SectionTitle>회의 개요</SectionTitle>
                    <Input placeholder="회의 제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Row>
                        <Input placeholder="일시" value={date} onChange={(e) => setDate(e.target.value)} />
                        <Input placeholder="참가자" value={participants} onChange={(e) => setParticipants(e.target.value)} />
                        <Input placeholder="장소" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </Row>
                </Section>

                <AgendaSection agendas={agendas} setAgendas={setAgendas} />
                <DecisionSection decisions={decisions} setDecisions={setDecisions} />

                <ButtonGroup>
                    <ActionButton>수정</ActionButton>
                    <ActionButton>저장</ActionButton>
                </ButtonGroup>
            </Content>
        </Container>
    );
}
