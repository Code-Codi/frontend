import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamProjectModal.scss";

export default function TeamProjectModal({ onClose, refreshProjects, editData }) {
  const [teamName, setTeamName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const loggedInUser = {
    id: 3,
    email: "prof@codi.com",
    userName: "김수현",
  };

  useEffect(() => {
    if (editData) {
      setTeamName(editData.name);
      setMemberList(editData.members.map(m => ({
        email: m.email,
        name: m.userName
      })));
    } else {
      setMemberList([{ email: loggedInUser.email, name: loggedInUser.userName }]);
    }
  }, [editData]);
  

  const handleAddMember = () => {
    if (!emailInput.trim()) return;

    axios.get(`http://localhost:8080/users/email/${emailInput}`)
      .then(res => {
        const user = res.data.result;
        const exists = memberList.some((m) => m.email === user.email);
        if (exists) {
          alert("이미 추가된 팀원입니다.");
          return;
        }
        setMemberList([...memberList, { email: user.email, name: user.userName }]);
        setEmailInput("");
      })
      .catch(() => {
        alert("해당 이메일의 사용자를 찾을 수 없습니다.");
      });
  };

  const handleSubmit = () => {
    if (!teamName.trim()) {
      alert("팀 이름을 입력하세요.");
      return;
    }

    const memberEmails = memberList.map((m) => m.email);

    const payload = {
      name: teamName,
      memberEmails: memberEmails,
    };

    const api = editData
      ? axios.patch(`http://localhost:8080/teamProject/${editData.id}`, payload)
      : axios.post("http://localhost:8080/teamProject", payload);

    api
      .then(() => setShowSuccess(true))
      .catch(err => {
        alert("팀 저장 실패");
        console.error(err);
      });
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    onClose();
    refreshProjects();
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h3>{editData ? "팀 수정" : "새 팀 프로젝트 생성"}</h3>
          <button className="edit-toggle-btn" onClick={onClose}>✕</button>
        </div>

        <label>
          팀 이름
          <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        </label>

        <label>
          팀원 추가 (이메일)
          <div className="email-add-row">
            <input
              type="email"
              placeholder="팀원 이메일 입력 후 Enter"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
            />
            <button className="email-add-btn" onClick={handleAddMember}>추가</button>
          </div>
        </label>

        <ul className="member-list">
          {memberList.map((m, idx) => (
            <li key={idx}>
              {m.name} ({m.email})
                <button
                  className="remove-member-btn"
                  onClick={() => {
                  setMemberList(prev => prev.filter((_, i) => i !== idx));
                }}
                 >
                  ✕
                </button>
            </li>
            ))}
        </ul>


        <div className="task-modal-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>{editData ? "수정" : "생성"}</button>
        </div>
      </div>

      {showSuccess && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>팀이 성공적으로 {editData ? "수정" : "생성"}되었습니다.</p>
            <div className="confirm-actions">
              <button onClick={handleSuccessConfirm}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
