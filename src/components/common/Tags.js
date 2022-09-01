import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

const TagsBlock = styled.div`
  margin-top: 0.5rem;
  color: ${palette.gray[9]};
`;

const Tag = styled.div`
  text-decoration: none;
  display: inline-block;
  font-size: 0.75rem;
  display: inline-block;
  border-radius: 20px;
  padding: 0.3rem 0.75rem;
  margin-right: 0.5rem;
  background: ${palette.cyan[5]};
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background: ${palette.cyan[2]};
  }
`;

const Tags = ({ tags }) => {
  return (
    <TagsBlock>
      {tags.map(tag => (
        <Tag>     
          <Link to={`/?tag=${tag}`} key={tag}>
            # {tag}
          </Link>
        </Tag>
      ))}
    </TagsBlock>
  );
};

export default Tags;