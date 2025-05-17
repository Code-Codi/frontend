import React, { useState, useRef, useEffect } from 'react';
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
  width: 100%;
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
  height: 46px;  
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 10px;
`;

const DisplayBox = styled.div`
  width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background: white;
  cursor: pointer;
  color: #343C6A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  height: 46px;
  display: flex;
  align-items: center;    
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 160px;
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 10px 16px;
  font-size: 15px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? '#e6f0ff' : 'white')};

  &:hover {
    background: #f0f0f0;
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
    const [participants, setParticipants] = useState([]);
    const [location, setLocation] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [agendas, setAgendas] = useState([{ title: '', details: [''] }]);
    const [decisions, setDecisions] = useState(['']);

    const participantOptions = ['ALL', '세미', '수현', '민경', '세령'];

    const handleToggleSelect = (value) => {
        if (value === 'ALL') {
            setParticipants(['ALL']);
        } else {
            setParticipants((prev) => {
                const exists = prev.includes(value);
                const filtered = prev.filter((p) => p !== 'ALL');
                return exists ? filtered.filter((p) => p !== value) : [...filtered, value];
            });
        }
    };

    const renderParticipantDisplay = () => {
        return participants.length === 0
            ? '참가자 선택'
            : participants.includes('ALL')
                ? 'ALL'
                : participants.join(', ');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Container>
            <Content>
                <Section>
                    <SectionTitle>회의 개요</SectionTitle>
                    <Input placeholder="회의 제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Row>
                        <div>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <DisplayBox onClick={() => setShowDropdown(!showDropdown)}>{renderParticipantDisplay()}</DisplayBox>
                            {showDropdown && (
                                <Dropdown>
                                    {participantOptions.map((name) => (
                                        <Option
                                            key={name}
                                            selected={participants.includes(name)}
                                            onClick={() => handleToggleSelect(name)}
                                        >
                                            {name}
                                        </Option>
                                    ))}
                                </Dropdown>
                            )}
                        </div>
                        <div>
                            <Input placeholder="장소" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
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
