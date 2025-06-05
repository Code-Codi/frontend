import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardWrapper = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
  color: #343c6a;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #718ebf;
`;

export default function PopularCard({ post }) {
  const thumbnail =
    post.thumbnail?.startsWith('http') && post.thumbnail.length > 8
      ? post.thumbnail
      : 'https://placehold.co/320x180?text=thumbnail';

  return (
    <Card>
      <Link to={`/share/${post.id}`}>
        <Thumbnail src={thumbnail} alt={post.title} />
        <Title>{post.title}</Title>
        <Footer>
          <span>{post.teamName}</span>
          <span>❤️ {post.favorites ?? 0}</span>
        </Footer>
      </Link>
    </Card>
  );
}
