import TextInput from './TextInput';
import './ProjectHome.scss';
import { useNavigate } from "react-router-dom";


const dummyData = [
  { id: 1, name: '데베프 프로젝트', type: '웹 개발 프로젝트', date: '2024.03.24', teamMember: '이세미, 김민경, 김수현, 김세령', status: '진행중', icon: '📍', bgColor: '#FFECEC' },
  { id: 2, name: '소시개 프로젝트', type: '웹 개발 프로젝트', date: '2024.03.24', teamMember: '이세미, 김민경, 김수현, 김세령', status: '진행중', icon: '💼', bgColor: '#FFF3E3' },
  { id: 3, name: '모응  프로젝트', type: '앱 개발 프로젝트', date: '2024.03.24', teamMember: '이세미, 김민경, 김수현, 김세령', status: '완료', icon: '📊', bgColor: '#FFECEC' },
 ];


export default function ProjectHome() {

const navigate = useNavigate();
const navigateToProject = () => {
  navigate("./subProject");
};

  return (
    <div className="project-container">
      <h2 className="project-title">모든 프로젝트</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>프로젝트 이름</th>
            <th>유형</th>
            <th>시작 날짜</th>
            <th>팀원</th>
            <th>상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((project) => (
            <tr key={project.id}>
              <td className="name-cell">
                <span
                  className="icon"
                  style={{ backgroundColor: project.bgColor }}
                >
                  {project.icon}
                </span>
                <TextInput init={project.name} />
              </td>
              <td><TextInput init={project.type} /></td>
              <td><TextInput init={project.date} /></td>
              <td><TextInput init={project.teamMember} /></td>
              <td><TextInput init={project.status} /></td>
              <td>
                <button className="details-btn" onClick={navigateToProject}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
