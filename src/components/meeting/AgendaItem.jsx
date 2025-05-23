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

export default function AgendaItem({ index, agenda, agendas, setAgendas, editing }) {
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

    return (
        <Card>
            <Label>안건 {index + 1} 제목</Label>
            <Input
                placeholder="안건 제목을 입력하세요"
                value={agenda.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                disabled={!editing}
            />
            <Label>상세 항목</Label>
            {agenda.details.map((detail, dIdx) => (
                <Input
                    key={detail.id || dIdx}
                    placeholder={`상세 항목 ${dIdx + 1}`}
                    value={detail.content}
                    onChange={(e) => handleDetailChange(dIdx, e.target.value)}
                    disabled={!editing}
                />
            ))}
            {editing && <AddDetailButton onClick={addDetail}>＋ 안건 상세 추가</AddDetailButton>}
        </Card>
    );
}
