import React from 'react';
import styled from 'styled-components';

const Title = styled.h2`
  font-size: 22px;
  color: #343C6A;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Section = styled.div`
    margin-bottom: 40px;
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

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`;

const Badge = styled.span`
    background: #3366ff;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
`;

const AddButton = styled.button`
  font-size: 16px;
  color: #1814f3;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-top: 10px;
`;

export default function DecisionSection({ decisions, setDecisions, editing }) {
    const handleChange = (index, value) => {
        const updated = [...decisions];
        updated[index] = {
            ...(typeof updated[index] === 'string' ? { id: undefined } : updated[index]),
            content: value,
        };
        setDecisions(updated);
    };

    const addDecision = () => {
        setDecisions([...decisions, { content: '' }]);
    };

    return (
        <Section>
            <Title>결정 사항</Title>
            {decisions.map((item, index) => (
                <Row key={index}>
                    <Badge>{index + 1}</Badge>
                    <Input
                        placeholder="결정 사항 내용을 입력하세요."
                        value={item.content || ''}
                        onChange={(e) => handleChange(index, e.target.value)}
                        disabled={!editing}
                    />
                </Row>
            ))}
            {editing && <AddButton onClick={addDecision}>＋ 결정 사항 추가</AddButton>}
        </Section>
    );
}
