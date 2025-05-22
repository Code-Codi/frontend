import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPost, getComments, postComment } from '../../api/board';
import CommentRow from '../../components/board/CommentRow';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f9fc;
  gap: 32px;
`;

const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #343c6a;
`;

const CommentTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;

  thead {
    color: #718ebf;
  }

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #e6eff5;
    text-align: left;
  }
`;

const InputArea = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #1814f3;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default function BoardDetail({ boardType }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchData = () => {
    getPost(boardType.toLowerCase(), postId).then((res) => setPost(res.data));
    getComments(postId).then((res) => setComments(res.data));
  };

  useEffect(() => {
    fetchData();
  }, [boardType, postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    await postComment(postId, {
      name: '익명',
      content: newComment.trim(),
    });

    setNewComment('');
    fetchData(); // 새로고침
  };

  if (!post) return <p style={{ padding: '24px' }}>Loading…</p>;

  return (
    <Wrapper>
      {/* 게시글 카드 */}
      <Card>
        <Title>{post.title}</Title>
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <img {...props} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ),
          }}
        />
      </Card>

      {/* 댓글 카드 */}
      <Card>
        <CommentTitle>Comments</CommentTitle>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Name</th>
              <th>Content</th>
              <th style={{ width: '20%' }}>Date</th>
              <th style={{ width: '10%' }}>Favorites</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}
          </tbody>
        </Table>

        {/* 댓글 입력창 */}
        <InputArea>
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim()}>
            등록
          </Button>
        </InputArea>
      </Card>
    </Wrapper>
  );
}
