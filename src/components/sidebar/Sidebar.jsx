import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as GuidelineIcon } from '../../assets/guideline.svg';
import { ReactComponent as ProjectIcon } from '../../assets/project.svg';
import { ReactComponent as MeetingIcon } from '../../assets/meeting.svg';
import { ReactComponent as CalendarIcon } from '../../assets/calendar.svg';
import { ReactComponent as TaskIcon } from '../../assets/task.svg';
import { ReactComponent as ShareIcon } from '../../assets/share.svg';

const SidebarContainer = styled.div`
  width: 248px;
  height: 100vh;
  padding-top: 90px;
  border-right: 2px solid #E6EFF5;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const SidebarItemsContainer = styled.div`
  position: relative;
  left: 70px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  top: 20px;
`;

const SidebarItemContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 60px;
  position: relative;
`;

const SidebarItem = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ active }) => (active ? '#1814F3' : '#B1B1B1')};
`;

const SidebarIndicator = styled.div`
  width: 6px;
  height: 60px;
  position: absolute;
  left: -70px;
  top: ${({ index }) => index * 75}px;
  background: #1814F3;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: top 0.3s ease;
`;

const ColoredIconBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: ${({ active }) => (active ? '#1814F3' : '#B1B1B1')};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const items = [
  { label: '홈', icon: HomeIcon },
  { label: '가이드라인', icon: GuidelineIcon },
  { label: '프로젝트', icon: ProjectIcon },
  { label: '캘린더', icon: CalendarIcon, path: '/schedule' },
  { label: '회의록', icon: MeetingIcon },
  { label: '과제', icon: TaskIcon },
  { label: '공유', icon: ShareIcon },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate(); 

  const handleItemClick = (index, path) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <SidebarContainer>
      <SidebarItemsContainer>
        <SidebarIndicator index={activeIndex} />
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeIndex === index;

          return (
            <SidebarItemContainer key={index} onClick={() => handleItemClick(index, item.path)}>
              <ColoredIconBox active={isActive}>
                <Icon />
              </ColoredIconBox>
              <SidebarItem active={isActive}>{item.label}</SidebarItem>
            </SidebarItemContainer>
          );
        })}
      </SidebarItemsContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
