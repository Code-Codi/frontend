import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskModal.scss";

const mapToEnumStatus = (status) => {
  switch (status) {
    case "할일":
    case "TODO":
      return "TODO";
    case "진행중":
    case "INPROGRESS":
      return "INPROGRESS";
    case "완료":
    case "COMPLETED":
      return "COMPLETED";
    default:
      return "TODO";
  }
};

export default function TaskModal({ status, onClose, initialData = null, refreshData, teamId }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    priority: "중",
    manager: "",
    startDate: "",
    targetDeadline: "",
    endDate: "",
    status: mapToEnumStatus(status),
  });

  const [isEditMode, setIsEditMode] = useState(!initialData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        status: mapToEnumStatus(initialData.status),
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
    const payload = { ...formData, teamId };

    try {
      if (formData.id) {
        await axios.patch(`http://localhost:8080/project/${formData.id}`, payload);
        refreshData(formData.id);
      } else {
        const res = await axios.post("http://localhost:8080/project", payload);
        const createdId = res.data.result.id;
        refreshData(createdId);
      }
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
        <div className="modal-header">
          <h3>{formData.name || "새 프로젝트"}</h3>
          <div className="modal-header-actions">
            {!isEditMode && (
              <button className="edit-toggle-btn" onClick={() => setIsEditMode(true)}>✏️ 수정</button>
            )}
            <button className="modal-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isEditMode && (
            <label>프로젝트명
              <input name="name" value={formData.name} onChange={handleChange} required />
            </label>
          )}

          <label>설명
            {isEditMode ? (
              <textarea name="description" value={formData.description} onChange={handleChange} />
            ) : (
              <div className="readonly-value">{formData.description || "-"}</div>
            )}
          </label>

          <label>우선순위
            {isEditMode ? (
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
              </select>
            ) : (
              <div className="readonly-value">{formData.priority}</div>
            )}
          </label>

          <label>담당자
            {isEditMode ? (
              <input name="manager" value={formData.manager} onChange={handleChange} />
            ) : (
              <div className="readonly-value">{formData.manager || "미정"}</div>
            )}
          </label>

          <label>상태
            {isEditMode ? (
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="TODO">할일</option>
                <option value="INPROGRESS">진행중</option>
                <option value="COMPLETED">완료</option>
              </select>
            ) : (
              <div className="readonly-value">
                {{
                  TODO: "할일",
                  INPROGRESS: "진행중",
                  COMPLETED: "완료",
                }[formData.status] || formData.status}
              </div>
            )}
          </label>

          {(formData.status === "INPROGRESS" || formData.status === "COMPLETED") && (
            <label>시작일
              {isEditMode ? (
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              ) : (
                <div className="readonly-value">{formData.startDate}</div>
              )}
            </label>
          )}

          {formData.status === "INPROGRESS" && (
            <label>목표 마감일
              {isEditMode ? (
                <input type="date" name="targetDeadline" value={formData.targetDeadline} onChange={handleChange} />
              ) : (
                <div className="readonly-value">{formData.targetDeadline}</div>
              )}
            </label>
          )}

          {formData.status === "COMPLETED" && (
            <label>마감일
              {isEditMode ? (
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
              ) : (
                <div className="readonly-value">{formData.endDate}</div>
              )}
            </label>
          )}

          <div className="task-modal-actions">
            {isEditMode ? (
              <>
                <button type="button" onClick={() => {
                  if (initialData) {
                    setFormData({ ...initialData, status: mapToEnumStatus(initialData.status) });
                    setIsEditMode(false);
                  } else {
                    onClose();
                  }
                }}>취소</button>
                <button type="submit">저장</button>
                {formData.id && (
                  <button type="button" className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>🗑 삭제</button>
                )}
              </>
            ) : (
              <>
                <button type="button" onClick={onClose}>닫기</button>
                {formData.id && (
                  <button type="button" className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>🗑 삭제</button>
                )}
              </>
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
