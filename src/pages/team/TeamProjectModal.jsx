import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamProjectModal.scss";
import { ReactComponent as ArrowDown } from "../../assets/arrowDown.svg";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";

export default function TeamProjectModal({
  onClose,
  refreshProjects,
  editData,
}) {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [teamName, setTeamName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [openCourse, setOpenCourse] = useState(false);
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // const fetchLoginUser = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:8080/users/me", {
    //       withCredentials: true,
    //     });
    //     setLoggedInUser(res.data.result);
    //   } catch (err) {
    //     console.error("로그인 사용자 정보 가져오기 실패", err);
    //   }
    // };
    // fetchLoginUser();
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/courses", {
          withCredentials: true,
        });
        console.log(res.data.result);
        setCourses(res.data.result);
      } catch (err) {
        console.error("강의 리스트 가져오기 실패", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (editData) {
      setTeamName(editData.name);
      setMemberList(
        editData.members.map((m) => ({
          email: m.email,
          name: m.username,
        }))
      );
    } else {
      setTeamName("");
      setMemberList([
        {
          email: email,
          name: username,
        },
      ]);
    }
  }, [editData]);

  const handleAddMember = () => {
    if (!emailInput.trim()) return;

    axios
      .get(`http://localhost:8080/users/email/${emailInput}`, {
        withCredentials: true,
      })
      .then((res) => {
        const user = res.data.result;
        const exists = memberList.some((m) => m.email === user.email);
        if (exists) {
          alert("이미 추가된 팀원입니다.");
          return;
        }
        setMemberList((prev) => [
          ...prev,
          { email: user.email, name: user.username },
        ]);
        setEmailInput("");
      })
      .catch(() => {
        alert("해당 이메일의 사용자를 찾을 수 없습니다.");
      });
  };

  const handleSubmit = () => {
    if (!selectedCourse) {
      alert("수업을 선택해주세요.");
      return;
    }

    if (!teamName.trim()) {
      alert("팀 이름을 입력하세요.");
      return;
    }

    const memberEmails = memberList.map((m) => m.email);
    console.log(memberEmails);

    const payload = {
      userId: userId,
      courseId: selectedCourse.id,
      name: teamName,
      memberEmails: memberEmails,
    };

    const api = editData
      ? axios.patch(
          `http://localhost:8080/teamProject/${editData.id}`,
          payload,
          {
            withCredentials: true,
          }
        )
      : axios.post("http://localhost:8080/teamProject", payload, {
          withCredentials: true,
        });

    api
      .then(() => setShowSuccess(true))
      .catch((err) => {
        alert(err.response?.data?.message);
        console.error(err);
      });
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    onClose();
    refreshProjects();
  };

  // 수업명 선택 핸들러
  const onSelectCourse = (course) => {
    setSelectedCourse(course);
    setOpenCourse(false);
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h3>{editData ? "팀 수정" : "새 팀 프로젝트 생성"}</h3>
          <button className="edit-toggle-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <label>
          수업
          <div
            className="select-box"
            onClick={(e) => {
              e.stopPropagation();
              setOpenCourse((prev) => !prev);
            }}
          >
            {selectedCourse ? selectedCourse.name : "선택하세요"}
            {openCourse ? (
              <ArrowUp className="dropdown-icon" />
            ) : (
              <ArrowDown className="dropdown-icon" />
            )}
          </div>
          {openCourse && (
            <div className="dropdown">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCourse(course);
                  }}
                >
                  {course.name}
                </div>
              ))}
            </div>
          )}
        </label>

        <label>
          팀 이름
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
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
            <button className="email-add-btn" onClick={handleAddMember}>
              추가
            </button>
          </div>
        </label>

        <ul className="member-list">
          {memberList.map((m, idx) => (
            <li key={idx}>
              {m.name} ({m.email})
              <button
                className="remove-member-btn"
                onClick={() =>
                  setMemberList((prev) => prev.filter((_, i) => i !== idx))
                }
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
