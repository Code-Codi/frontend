import React from 'react';
import styled from 'styled-components';
import AgendaItem from './AgendaItem';

const Section = styled.div`
    margin-bottom: 40px;
    width: 100%;
`;

const Title = styled.h2`
  font-size: 22px;
  color: #343C6A;
  font-weight: bold;
  margin-bottom: 16px;
`;

const AddButton = styled.button`
  font-size: 16px;
  color: #1814f3;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-top: 20px;
`;

export default function AgendaSection({ agendas, setAgendas, editing }) {
    const addAgenda = () => {
        setAgendas([...agendas, { title: '', details: [{ content: '' }] }]);
    };

    return (
        <Section>
            <Title>주요 안건</Title>
            {agendas.map((agenda, index) => (
                <AgendaItem
                    key={index}
                    index={index}
                    agenda={agenda}
                    agendas={agendas}
                    setAgendas={setAgendas}
                    editing={editing}
                />
            ))}
            {editing && <AddButton onClick={addAgenda}>＋ 안건 추가</AddButton>}
        </Section>
    );
}
