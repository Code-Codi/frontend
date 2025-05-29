import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./TaskBoard.scss";
import TaskModal from "./TaskModal";

export default function TaskBoard() {
  const [groupedProjects, setGroupedProjects] = useState({ 할일: [], 진행중: [], 완료: [] });
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [sortType, setSortType] = useState("createdAt");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamId = queryParams.get("teamId");

  const fetchProjects = useCallback((highlightedId = null) => {
    axios.get(`http://localhost:8080/project?teamId=${teamId}`).then((res) => {
      let projects = res.data.result;

      // 정렬
      if (sortType === "createdAt") {
        projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        const priorityOrder = { 상: 1, 중: 2, 하: 3 };
        projects.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      }

      const grouped = { 할일: [], 진행중: [], 완료: [] };

      projects.forEach((p) => {
        const card = {
          ...p,
          code: `P-${p.id}`,
          period:
            p.status === "COMPLETED"
              ? `${p.startDate || ""} ~ ${p.endDate || ""}`
              : p.status === "INPROGRESS" && p.startDate
              ? `${p.startDate} ~`
              : "",
          owner: p.manager || "미정",
        };

        if (p.status === "TODO") grouped.할일.push(card);
        else if (p.status === "INPROGRESS") grouped.진행중.push(card);
        else if (p.status === "COMPLETED") grouped.완료.push(card);
      });

      setGroupedProjects(grouped);
      if (highlightedId) {
        setHighlightId(highlightedId);
        setTimeout(() => setHighlightId(null), 3000);
      }
    });
  }, [sortType, teamId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddTask = (status) => {
    setModalStatus(status);
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (card, status) => {
    setModalStatus(status);
    setSelectedProject({ ...card, status });
    setShowModal(true);
  };

  const toggleSortType = () => {
    setSortType((prev) => (prev === "createdAt" ? "priority" : "createdAt"));
  };

  return (
    <div className="taskboard-container">
      <div className="taskboard-header">
        <h2 className="project-name">프로젝트 목록</h2>
        <button className="sort-toggle-btn" onClick={toggleSortType}>
          🔁 {sortType === "createdAt" ? "최근 생성순" : "우선순위순"}
        </button>
      </div>

      <div className="task-columns">
        {Object.entries(groupedProjects).map(([status, cards]) => (
          <div className="task-column" key={status}>
            <div className="column-header">
              <span>{status}</span>
              <span className="task-count">{cards.length}</span>
            </div>
            <div className="task-card-list">
              {cards.map((card) => (
                <div
                  className={`task-card ${highlightId === card.id ? "highlight" : ""}`}
                  key={card.id}
                  onClick={() => handleEdit(card, status)}
                >
                  <div className="task-title">{card.name}</div>
                  <div className="task-code">{card.code}</div>
                  {card.period && <div className="task-period">{card.period}</div>}
                  <div className="task-owner">담당자: {card.owner}</div>
                </div>
              ))}
            </div>
            <button className="add-task-btn" onClick={() => handleAddTask(status)}>+</button>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal
          status={modalStatus}
          onClose={() => setShowModal(false)}
          initialData={selectedProject}
          refreshData={fetchProjects}
          teamId={teamId} 
        />
      )}
    </div>
  );
}
