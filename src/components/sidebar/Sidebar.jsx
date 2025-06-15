import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as GuidelineIcon } from "../../assets/guideline.svg";
import { ReactComponent as ProjectIcon } from "../../assets/project.svg";
import { ReactComponent as MeetingIcon } from "../../assets/meeting.svg";
import { ReactComponent as CalendarIcon } from "../../assets/calendar.svg";
import { ReactComponent as TaskIcon } from "../../assets/task.svg";

const SidebarContainer = styled.div`
  width: 248px;
  height: 100vh;
  padding-top: 90px;
  border-right: 2px solid #e6eff5;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const SidebarItemsContainer = styled.div`
  position: relative;
  padding-left: 70px;
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
  color: ${({ active }) => (active ? "#1814F3" : "#B1B1B1")};
`;

const SidebarIndicator = styled.div`
  width: 6px;
  height: 60px;
  position: absolute;
  margin-left: -70px;
  top: ${({ index }) => index * 75}px;
  background: #1814f3;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: top 0.3s ease;
`;

const ColoredIconBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: ${({ active }) => (active ? "#1814F3" : "#B1B1B1")};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const items = [
  { label: "홈", icon: HomeIcon, path: "/share" },
  { label: "가이드라인", icon: GuidelineIcon, path: "/guide" },
  { label: "프로젝트", icon: ProjectIcon, path: "/project" },
  { label: "캘린더", icon: CalendarIcon, path: "/schedule" },
  { label: "회의록", icon: MeetingIcon, path: "/meetingList" },
  { label: "과제", icon: TaskIcon, path: "/taskList" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const teamId = localStorage.getItem("teamId");

  const getActiveIndex = () =>
    items.findIndex((item) => location.pathname.startsWith(item.path));

  const activeIndex = getActiveIndex();

  const handleItemClick = (path) => {
    if (path) {
      if (teamId) {
        navigate(`${path}?teamId=${teamId}`);
      } else {
        navigate(path);
      }
    }
  };

  return (
    <SidebarContainer>
      <SidebarItemsContainer>
        <SidebarIndicator index={activeIndex} />
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeIndex === index;

          return (
            <SidebarItemContainer
              key={index}
              onClick={() => handleItemClick(item.path)}
            >
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
