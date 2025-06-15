import styled from "styled-components";
import { ReactComponent as LogoutSVG } from "../../assets/logout.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDown.svg";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";
import { ReactComponent as TaskIcon } from "../../assets/task.svg";
import React, { useState, useEffect, useRef } from "react";
import { LogoutModal } from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HeaderWrapper = styled.div`
  height: 90px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 2px solid #e6eff5;
  background-color: white;
  z-index: 1000;
`;

const LogoutIcon = styled(LogoutSVG)`
  width: 30px;
  height: 30px;
  position: absolute;
  cursor: pointer;
  top: 25px;
  right: 40px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 120px;
  position: absolute;
  left: 20px;
  top: 25px;
  color: #343c6a;
  font-size: 25px;
  font-weight: bold;
`;

const Logo = styled.div`
  color: #343c6a;
  font-size: 25px;
  font-weight: bold;
`;

const StyledDropDown = styled(ArrowDown)`
  width: 30px;
  height: 30px;
  fill: #343c6a;
  cursor: pointer;
`;

const DropDownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const TitleText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #343c6a;
`;

const StyledTaskIcon = styled(TaskIcon)`
  width: 18px;
  height: 20px;
  margin-left: auto;
  transform: translate(0, -20%);
  cursor: pointer;
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  width: 250px;
  background: #fff;
  border: 1px solid #d3d3d3;
  padding: 20px;
  border-radius: 5px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  color: #343c6a;
  font-size: 18px;

  div {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #7a7a7a;
  }

  li {
    padding: 13px 10px;
    cursor: pointer;
  }
`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const dropDownRef = useRef(null);

  const fetchProjects = async () => {
    if (!userId) {
      console.warn("userId가 없습니다. fetchProjects 중단");
      return [];
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/teamProject/my/${userId}`
      );
      const teamList = res.data.result;

      const teamsWithMembers = await Promise.all(
        teamList.map(async (team) => {
          try {
            const memberRes = await axios.get(
              `http://localhost:8080/teamProject/${team.id}/members`
            );
            return { ...team, members: memberRes.data.result };
          } catch (err) {
            console.error(`❌ 팀 ${team.id} 멤버 조회 실패, err`);
            return { ...team, members: [] };
          }
        })
      );
      return teamsWithMembers;
    } catch (err) {
      console.error("내 팀 목록 가져오기 실패", err);
      return [];
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/courses", {
        withCredentials: true,
      });
      console.log(res.data.result);
      return res.data.result;
    } catch (err) {
      console.error("강의 리스트 가져오기 실패", err);
    }
  };

  useEffect(() => {
    if (open && userId) {
      (async () => {
        if (role === "STUDENT") {
          const res = await fetchProjects();
          setItems(res);
        } else if (role === "PROFESSOR") {
          const res = await fetchCourses();
          setItems(res);
        }
      })();
    }
  }, [open, userId, role]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <HeaderWrapper>
      {userId && <LogoutIcon onClick={() => setOpenLogout(true)} />}
      <LogoContainer>
        <Logo>CODI</Logo>
        {userId && (
          <DropDownWrapper ref={dropDownRef}>
            {open ? (
              <StyledDropDown as={ArrowUp} onClick={() => setOpen(false)} />
            ) : (
              <StyledDropDown as={ArrowDown} onClick={() => setOpen(true)} />
            )}

            {open && (
              <Menu>
                <TitleWrapper>
                  <TitleText>
                    {role === "STUDENT" ? "내 워크스페이스" : "내 수업"}
                  </TitleText>
                  {role === "STUDENT" && (
                    <StyledTaskIcon onClick={() => navigate("/teamProject")} />
                  )}
                </TitleWrapper>
                <ul>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          if (role === "STUDENT") {
                            localStorage.setItem("teamId", item.id);
                            navigate(`/project?teamId=${item.id}`);
                          } else if (role === "PROFESSOR") {
                            //navigate(`/class?classId=${item.id}`);
                          }
                          setOpen(false);
                        }}
                      >
                        {item.name}
                      </li>
                    ))
                  ) : (
                    <li>목록이 없습니다</li>
                  )}
                </ul>
              </Menu>
            )}
          </DropDownWrapper>
        )}

        {openLogout && <LogoutModal onClose={() => setOpenLogout(false)} />}
      </LogoContainer>
    </HeaderWrapper>
  );
}
