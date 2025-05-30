import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { createPost } from '../../api/board/board';

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

export default function PostWriteForm({ boardType }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [writerId, setWriterId] = useState(null);

  // 로그인 사용자 정보 가져오기
  useEffect(() => {
  axios.get('http://localhost:8080/users/me', { withCredentials: true })
    .then(res => {
      setWriterId(res.data.result.id);
    })
    .catch(err => {
      console.error('사용자 정보 가져오기 실패:', err);
      alert('로그인이 필요합니다.');
    });
}, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!writerId) {
      alert('로그인 후 다시 시도해주세요.');
      return;
    }

    const formData = new FormData();

    const postDto = {
      title,
      content,
      boardType,
      teamName: '1팀',
      type: '일반',
      thumbnail: '',
      writerId: writerId,
    };

    const jsonBlob = new Blob([JSON.stringify(postDto)], {
      type: 'application/json',
    });
    formData.append('post', jsonBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await createPost(formData);
      const postId = res.data.result.postId;
      navigate(`/${boardType.toLowerCase()}/${postId}`);
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('등록 실패');
    }
  };

  return (
    <Wrapper>
      <Card>
        <h2>게시글 작성</h2>
        <Input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="내용 (마크다운 가능)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
