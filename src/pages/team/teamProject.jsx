import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import './TeamProject.scss';
import TeamProjectModal from './TeamProjectModal';

export default function TeamProject() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [teamToLeave, setTeamToLeave] = useState(null);
  const [highlightTeamId, setHighlightTeamId] = useState(null);
  const navigate = useNavigate();

  const userId = 3;

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/teamProject/my/${userId}`);
      const teamList = res.data.result;

      const teamsWithMembers = await Promise.all(
        teamList.map(async (team) => {
          try {
            const memberRes = await axios.get(`http://localhost:8080/teamProject/${team.id}/members`);
            return { ...team, members: memberRes.data.result };
          } catch (err) {
            console.error(`팀 ID ${team.id}의 멤버 조회 실패`, err);
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

  const handleLeave = () => {
    axios.delete(`http://localhost:8080/teamProject/${teamToLeave}/member/${userId}`)
      .then(() => {
        setShowLeaveConfirm(false);
        setTeamToLeave(null);
        handleRefresh();
      })
      .catch(err => {
        alert("팀 나가기 실패");
        console.error(err);
      });
  };

  useEffect(() => {
    // 초기 로딩 시
    fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (highlightTeamId) {
      const timer = setTimeout(() => setHighlightTeamId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightTeamId]);

  const handleModalClose = () => {
    setShowModal(false);
    setEditTarget(null);
  };
  const handleRefresh = async () => {
    const prevIds = projects.map(p => p.id);
    const updatedProjects = await fetchProjects();
  
    const newTeam = updatedProjects.find(p => !prevIds.includes(p.id));
  
    if (newTeam) {
      const sortedProjects = [
        ...updatedProjects.filter(p => p.id !== newTeam.id),
        newTeam,
      ];
      setProjects(sortedProjects);
      setHighlightTeamId(newTeam.id);
    } else if (editTarget) {
      setProjects(updatedProjects);
      setHighlightTeamId(editTarget.id);
    } else {
      setProjects(updatedProjects);
    }
  };
  
  
  

  return (
    <div className="team-project-container">
      <h2 className="main-title">내 워크스페이스</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div
            className={`project-card ${highlightTeamId === project.id ? 'highlight' : ''}`}
            key={project.id}
          >
            <div className="card-icons">
              <button
                className="icon-btn edit"
                title="수정"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTarget(project);
                }}
              >
                <Pencil size={18} />
              </button>
              <button
                className="icon-btn leave"
                title="삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  setTeamToLeave(project.id);
                  setShowLeaveConfirm(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div
              className="card-content"
              onClick={() => navigate(`/project?teamId=${project.id}`)}
            >
              <p className="project-title">{project.name}</p>
              <div className="project-members">
                <div className="label-row">
                  <span className="label">👥 팀원:</span>
                  <span className="member-names">
                    {project.members.length > 0
                      ? project.members.map((m) => m.userName).join(', ')
                      : '팀원이 없습니다.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div>
          <button className="add-project-btn" onClick={() => setShowModal(true)}>
            +
          </button>
        </div>
      </div>

      {(showModal || editTarget) && (
        <TeamProjectModal
          onClose={handleModalClose}
          refreshProjects={handleRefresh}
          editData={editTarget}
        />
      )}

      {showLeaveConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>
              정말 삭제 하시겠습니까?
              <br />삭제하면 이 팀을 나가게 됩니다.
            </p>
            <div className="confirm-actions">
              <button onClick={handleLeave}>예</button>
              <button onClick={() => setShowLeaveConfirm(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
