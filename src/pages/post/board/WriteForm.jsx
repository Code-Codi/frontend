import { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 40px 24px;
  display: flex;
  justify-content: center;
  background-color: #f6f9fc;
`;

const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Textarea = styled.textarea`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  height: 150px;
`;

const FileInput = styled.input`
  margin-top: 8px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-top: 8px;
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #1814f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
`;

export default function PostWriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log({
      title,
      content,
      image,
    });
    // TODO: 서버 전송 로직 (FormData 등)
  };

  return (
    <Wrapper>
      <Card>
        <h2>게시글 작성</h2>
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder={`내용을 입력하세요 (Markdown 사용 가능)\n예: https://example.com 자동 링크 처리됨`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 이미지 업로드 */}
        <div>
          <label>이미지 첨부:</label>
          <FileInput type="file" accept="image/*" onChange={handleImageChange} />
          {image && <PreviewImage src={image} alt="Preview" />}
        </div>

        <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
      </Card>
    </Wrapper>
  );
}
