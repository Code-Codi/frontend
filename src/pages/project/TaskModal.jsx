import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskModal.scss";

export default function TaskModal({ status, onClose, initialData = null, refreshData }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    priority: "중",
    repeat: false,
    manager: "",
    startDate: "",
    targetDeadline: "",
    endDate: "",
    progressPercent: 0,
    status: status === "할일" ? "todo" : status === "진행중" ? "inprogress" : "completed",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      const convertedStatus =
        initialData.status === "할일"
          ? "todo"
          : initialData.status === "진행중"
          ? "inprogress"
          : initialData.status === "완료"
          ? "completed"
          : initialData.status;

      setFormData({
        ...initialData,
        status: convertedStatus,
      });
    }
  }, [initialData]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, teamId: 1 };

    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/project/${formData.id}`, payload);
      } else {
        await axios.post("http://localhost:8080/project", payload);
      }
      refreshData();
      onClose();
    } catch (err) {
      console.error("저장 실패", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/project/${formData.id}`);
      refreshData();
      onClose();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <h3>{formData.id ? "프로젝트 수정" : "새 프로젝트 등록"} <span className="modal-status">({status})</span></h3>
        <form onSubmit={handleSubmit}>
          <label>프로젝트명
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>설명
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>우선순위
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </label>

          <label className="checkbox-row">
            <input type="checkbox" name="repeat" checked={formData.repeat} onChange={handleChange} />
            반복 여부
          </label>

          <label>담당자
            <input name="manager" value={formData.manager} onChange={handleChange} />
          </label>

          <label>상태
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="todo">할일</option>
              <option value="inprogress">진행중</option>
              <option value="completed">완료</option>
            </select>
          </label>

          {(formData.status === "inprogress" || formData.status === "completed") && (
            <label>시작일
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </label>
          )}

          {formData.status === "inprogress" && (
            <label>목표 마감일
              <input type="date" name="targetDeadline" value={formData.targetDeadline} onChange={handleChange} />
            </label>
          )}

          {formData.status === "completed" && (
            <label>마감일
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </label>
          )}

          <div className="task-modal-actions">
            <button type="submit">저장</button>
            <button type="button" onClick={onClose}>취소</button>
            {formData.id && (
              <button type="button" className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>🗑 삭제</button>
            )}
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <p>정말 이 프로젝트를 삭제하시겠습니까?</p>
              <div className="confirm-actions">
                <button onClick={handleDelete}>예</button>
                <button onClick={() => setShowDeleteConfirm(false)}>아니오</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
