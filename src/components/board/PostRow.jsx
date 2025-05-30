import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Row = styled.tr`
  border-bottom: 1px solid #e6eff5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }
`;

const Cell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #343c6a;
  white-space: nowrap;
`;

const TitleCell = styled(Cell)`
  font-weight: 600;
  color: #1814f3;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function PostRow({ post, boardType }) {

const handleFavorite = async (postId) => {
  try {
    await axios.post(`/post/${postId}/favorite`);
    window.location.reload();
  } catch (e) {
    console.error('Failed to favorite:', e);
  }
};


  return (
    <Row>
      <TitleCell>
        <Link to={`/${boardType.toLowerCase()}/${post.id}`}>
          {post.title}
        </Link>
      </TitleCell>
      <Cell>{post.writerId || '-'}</Cell>
      <Cell>{post.visitors || 0}</Cell>
      <Cell>{post.createdAt?.slice(0, 10) || '-'}</Cell>
      <Cell>❤️ {post.favorites || 0}
         <button
          onClick={handleFavorite}
          style={{
            marginLeft: '8px',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            cursor: 'pointer',
            backgroundColor: 'white',
          }}
        >
          ♡</button>
      </Cell>
    </Row>
  );
}
