import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    width: 100%;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    margin-top: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
    box-sizing: border-box;
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    margin-top: 8px;
    box-sizing: border-box;
    min-height: 60px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;

    &:disabled {
        background: #f5f5f5;
        color: #888;
    }
`;

const Label = styled.div`
    font-weight: 600;
    margin-top: 12px;
    color: #343C6A;
`;

const AddDetailButton = styled.button`
    font-size: 14px;
    color: #1814f3;
    background: none;
    border: none;
    cursor: pointer;
    margin-top: 12px;
`;

const DeleteIcon = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: #888;
  margin-left: 8px;

  &:hover {
    color: red;
  }
`;

export default function AgendaItem({ index, agenda, agendas, setAgendas, editing, setDeletedAgendaDetailIds }) {
    const handleTitleChange = (value) => {
        const updated = [...agendas];
        updated[index].title = value;
        setAgendas(updated);
    };

    const handleDetailChange = (detailIndex, value) => {
        const updated = [...agendas];
        updated[index].details[detailIndex].content = value;
        setAgendas(updated);
    };

    const addDetail = () => {
        const updated = [...agendas];
        updated[index].details.push({ content: '' });
        setAgendas(updated);
    };

    const deleteDetail = (detailIndex) => {
        const updated = [...agendas];
        const removed = updated[index].details.splice(detailIndex, 1)[0];
        setAgendas(updated);

        if (removed.id) {
            setDeletedAgendaDetailIds(prev => [...prev, removed.id]);
        }
    };


    const deleteAgenda = () => {
        const target = agendas[index];
        // agenda 내부 detail도 삭제 대상 등록
        if (target.details) {
            target.details.forEach(d => {
                if (d.id) {
                    setDeletedAgendaDetailIds(prev => [...prev, d.id]);
                }
            });
        }
        const updated = agendas.filter((_, i) => i !== index);
        setAgendas(updated);
    };

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Label>안건 {index + 1} 제목</Label>
                {editing && <DeleteIcon onClick={deleteAgenda}>🗑</DeleteIcon>}
            </div>
            <Input
                placeholder="안건 제목을 입력하세요"
                value={agenda.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                disabled={!editing}
            />
            <Label>상세 항목</Label>
            {agenda.details.map((detail, dIdx) => (
                <div style={{ display: 'flex', alignItems: 'center' }} key={detail.id || dIdx}>
                    <StyledTextarea
                        placeholder={`상세 항목 ${dIdx + 1}`}
                        value={detail.content}
                        onChange={(e) => handleDetailChange(dIdx, e.target.value)}
                        disabled={!editing}
                    />
                    {editing && <DeleteIcon onClick={() => deleteDetail(dIdx)}>🗑</DeleteIcon>}
                </div>
            ))}
            {editing && <AddDetailButton onClick={addDetail}>＋ 안건 상세 추가</AddDetailButton>}
        </Card>
    );
}
