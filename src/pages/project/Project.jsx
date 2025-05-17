import React, { useEffect, useState } from "react";
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

  const fetchProjects = () => {
    axios.get("http://localhost:8080/project").then((res) => {
      const grouped = { 할일: [], 진행중: [], 완료: [] };
      res.data.forEach((project) => {
        const card = {
          id: project.id,
          name: project.name,
          description: project.description,
          priority: project.priority,
          repeat: project.repeat,
          manager: project.manager,
          startDate: project.startDate,
          endDate: project.endDate,
          targetDeadline: project.targetDeadline,
          progressPercent: project.progressPercent,
          status: project.status,
          code: `P-${project.id}`,
          period: project.endDate
            ? `${project.startDate} ~ ${project.endDate}`
            : `${project.startDate} ~`,
          owner: project.manager || "미정",
        };

        if (project.status === "todo") grouped.할일.push(card);
        else if (project.status === "inprogress") grouped.진행중.push(card);
        else if (project.status === "completed") grouped.완료.push(card);
      });
      setGroupedProjects(grouped);
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <div className="taskboard-container">
      <h2 className="project-name">프로젝트 목록</h2>
      <div className="task-columns">
        {Object.entries(groupedProjects).map(([status, cards]) => (
          <div className="task-column" key={status}>
            <div className="column-header">
              <span>{status}</span>
              <span className="task-count">{cards.length}</span>
            </div>
            <div className="task-card-list">
              {cards.map((card, idx) => (
                <div className="task-card" key={idx} onClick={() => handleEdit(card, status)}>
                  <div className="task-title">{card.name}</div>
                  <div className="task-code">{card.code}</div>
                  <div className="task-period">{card.period}</div>
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
        />
      )}
    </div>
  );
}
