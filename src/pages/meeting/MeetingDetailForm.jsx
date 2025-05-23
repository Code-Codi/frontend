import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
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
    const { meetingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isCreateMode = location.pathname === '/meetingCreate';
    const [editing, setEditing] = useState(isCreateMode);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [participants, setParticipants] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [agendas, setAgendas] = useState([{ title: '', details: [''] }]);
    const [decisions, setDecisions] = useState(['']);

    const participantOptions = ['ALL', '세미', '수현', '민경', '세령'];
    const handleCreate = async () => {
        try {
            const formattedDateTime = `${date}T00:00:00`;

            const res = await axios.post('http://localhost:8080/meeting', {
                teamId: 1,
                title,
                dateTime: formattedDateTime,
                location: locationName
            });

            const meetingId = res.data.result;

            for (const agenda of agendas) {
                const agendaRes = await axios.post('http://localhost:8080/meeting/item/agenda', {
                    meetingId,
                    title: agenda.title
                });

                const agendaId = agendaRes.data.result;

                for (const detail of agenda.details) {
                    await axios.post('http://localhost:8080/meeting/item/agenda-detail', {
                        agendaId,
                        content: detail
                    });
                }
            }

            for (const content of decisions) {
                await axios.post('http://localhost:8080/meeting/item/decision', {
                    meetingId,
                    content
                });
            }

            alert('회의록이 성공적으로 등록되었습니다!');
            navigate(`/meetingDetail/${meetingId}`);
        } catch (error) {
            console.error('등록 중 오류:', error);
            alert('회의록 등록에 실패했습니다.');
        }
    };

    const handleUpdate = async () => {
        try {
            // 1. Meeting 자체 수정
            const formattedDateTime = `${date}T00:00:00`;
            await axios.patch(`http://localhost:8080/meeting/${meetingId}`, {
                title,
                dateTime: formattedDateTime,
                location: locationName,
            });

            // 2. Agenda + AgendaDetail 수정/등록
            for (const agenda of agendas) {
                let agendaId = agenda.id;

                // 기존 agenda 수정
                if (agendaId) {
                    await axios.patch(`http://localhost:8080/meeting/item/agenda/${agendaId}`, {
                        title: agenda.title
                    });
                } else {
                    // 새 agenda 등록
                    const agendaRes = await axios.post("http://localhost:8080/meeting/item/agenda", {
                        meetingId,
                        title: agenda.title
                    });
                    agendaId = agendaRes.data.result;
                }

                // AgendaDetail 수정/등록
                for (const detail of agenda.details) {
                    if (detail.id) {
                        await axios.patch(`http://localhost:8080/meeting/item/agenda-detail/${detail.id}`, {
                            content: detail.content
                        });
                    } else {
                        await axios.post("http://localhost:8080/meeting/item/agenda-detail", {
                            agendaId,
                            content: detail.content
                        });
                    }
                }
            }

            // 3. Decision 수정/등록
            for (const decision of decisions) {
                if (decision.id) {
                    await axios.patch(`http://localhost:8080/meeting/item/decision/${decision.id}`, {
                        content: decision.content
                    });
                } else {
                    await axios.post(`http://localhost:8080/meeting/item/decision`, {
                        meetingId,
                        content: decision.content
                    });
                }
            }

            alert("회의록이 성공적으로 수정되었습니다!");
            setEditing(false);
        } catch (error) {
            console.error("수정 중 오류:", error);
            alert("회의록 수정에 실패했습니다.");
        }
    };


    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/meeting/${meetingId}`);
                const data = res.data.result;

                setTitle(data.title);
                setDate(data.dateTime.split('T')[0]);
                setLocationName(data.location);

                //  객체 -> 문자열로 변환
                const processedAgendas = data.agendas.map((agenda) => ({
                    id: agenda.id,
                    title: agenda.title,
                    details: agenda.details.map((detail) => ({
                        id: detail.id,
                        content: detail.content
                    }))
                }));
                setAgendas(processedAgendas);

                const processedDecisions = data.decisions.map((d) => ({
                    id: d.id,
                    content: d.content
                }));
                setDecisions(processedDecisions);

            } catch (err) {
                console.error('회의 조회 실패:', err);
            }
        };

        if (meetingId) fetchMeeting();
    }, [meetingId]);


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
                    <Input placeholder="회의 제목을 입력하세요." value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editing}/>
                    <Row>
                        <div>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!editing} />
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
                            <Input placeholder="장소" value={locationName} onChange={(e) => setLocationName(e.target.value)} disabled={!editing}/>
                        </div>
                    </Row>
                </Section>

                <AgendaSection agendas={agendas} setAgendas={setAgendas}  editing={editing} />
                <DecisionSection decisions={decisions} setDecisions={setDecisions}  editing={editing} />

                <ButtonGroup>
                    {isCreateMode ? (
                        <ActionButton onClick={handleCreate}>등록</ActionButton>
                    ) : !editing ? (
                        <ActionButton onClick={() => setEditing(true)}>수정</ActionButton>
                    ) : (
                        <ActionButton onClick={handleUpdate}>저장</ActionButton>
                    )}
                </ButtonGroup>
            </Content>
        </Container>
    );
}
