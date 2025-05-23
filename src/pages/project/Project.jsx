import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./TaskBoard.scss";
import TaskModal from "./TaskModal";

export default function TaskBoard() {
  const [groupedProjects, setGroupedProjects] = useState({
    할일: [],
    진행중: [],
    완료: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [sortType, setSortType] = useState("createdAt");

  const fetchProjects = useCallback((highlightedId = null) => {
    axios.get("http://localhost:8080/project").then((res) => {
      let projects = res.data.result;

      if (sortType === "createdAt") {
        projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortType === "priority") {
        const priorityOrder = { 상: 1, 중: 2, 하: 3 };
        projects.sort((a, b) => {
          const pa = priorityOrder[a.priority] || 4;
          const pb = priorityOrder[b.priority] || 4;
          return pa - pb;
        });
      }

      const grouped = { 할일: [], 진행중: [], 완료: [] };

      projects.forEach((project) => {
        let period = "";
        if (project.status === "INPROGRESS" && project.startDate) {
          period = `${project.startDate} ~`;
        } else if (project.status === "COMPLETED") {
          if (project.startDate && project.endDate) {
            period = `${project.startDate} ~ ${project.endDate}`;
          } else if (project.startDate) {
            period = `${project.startDate} ~`;
          } else if (project.endDate) {
            period = `~ ${project.endDate}`;
          }
        }

        const card = {
          id: project.id,
          name: project.name,
          description: project.description,
          priority: project.priority,
          manager: project.manager,
          startDate: project.startDate,
          endDate: project.endDate,
          targetDeadline: project.targetDeadline,
          status: project.status,
          code: `P-${project.id}`,
          period,
          owner: project.manager || "미정",
        };

        if (project.status === "TODO") grouped.할일.push(card);
        else if (project.status === "INPROGRESS") grouped.진행중.push(card);
        else if (project.status === "COMPLETED") grouped.완료.push(card);
      });

      setGroupedProjects(grouped);

      if (highlightedId) {
        setHighlightId(highlightedId);
        setTimeout(() => setHighlightId(null), 3000);
      }
    });
  }, [sortType]);

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
              {cards.map((card, idx) => (
                <div
                  className={`task-card ${highlightId === card.id ? "highlight" : ""}`}
                  key={idx}
                  onClick={() => handleEdit(card, status)}
                >
                  <div className="task-title">{card.name}</div>
                  <div className="task-code">{card.code}</div>
                  {(card.status === "INPROGRESS" || card.status === "COMPLETED") && (
                    <div className="task-period">{card.period}</div>
                  )}
                  <div className="task-owner">담당자: {card.owner}</div>
                </div>
              ))}
            </div>
            <button className="add-task-btn" onClick={() => handleAddTask(status)}>
              +
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal
          status={modalStatus}
          onClose={() => setShowModal(false)}
          initialData={selectedProject}
          refreshData={fetchProjects}
        />
      )}
    </div>
  );
}
