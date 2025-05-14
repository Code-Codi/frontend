import React from "react";
import './TaskBoard.scss';

const dummyData = {
    할일: [
        { title: '칸반보드 기능 구현', code: 'ABC-1', period: '2025.03.30~', owner: '이세미' },
        { title: '캘린더 기능 구현', code: 'JFE-2', period: '2025.03.30~', owner: '이세미' },
        { title: '과제 제출 기능 구현', code: 'RJE-3', period: '2025.03.30~', owner: '이세미' },
        { title: '공유 기능 구현', code: 'JFE-4', period: '2025.03.30~', owner: '이세미' },
        { title: '마이페이지 구현', code: 'ABC-1', period: '2025.03.30~', owner: '이세미' },
      ],
      진행중: [
        { title: '홈 구현', code: 'ABC-1', period: '2025.03.30~', owner: '이세미' },
        { title: '홈 구현', code: 'DJF-12', period: '2025.04.02~', owner: '김수현' },
        { title: '프로젝트 화면 구현', code: 'EIF-3', period: '2025.04.02~', owner: '김민경' },
        { title: '프로젝트 화면 구현', code: 'WLEQ-5', period: '2025.04.02~', owner: '김민경' },
      ],
      완료: [
        { title: 'ㅇㅇㅇ 화면 구현', code: 'ABC-1', period: '2024.03.10 ~ 2024.05.10', owner: '이세미' },
        { title: 'db 스키마 생성', code: 'ABC-1', period: '2024.06.15 ~ 2024.08.24', owner: '이세미' },
        { title: '회의록 작성', code: 'ABC-1', period: '2025.02.10 ~ 2025.03.30', owner: '이세미' },
      ]
    };

export default function TaskBoard(){
    return (
        <div className="taskboard-container">
            <h2 className="project-name">데베프 프로젝트</h2>
            <div className="task-columns">
                {Object.entries(dummyData).map(([status, cards]) => (
                    <div className="task-column" key={status}>
                        <div className="column-header">
                            <span>{status}</span>
                            <span className="task-count">{cards.length}</span>
                        </div>
                        <div className="task-card-list">
                            {cards.map((card, idx) => (
                                <div className="task-card" key={idx}>
                                <div className="task-title">{card.title}</div>
                                <div className="task-code">{card.code}</div>
                                <div className="task-period">{card.period}</div>
                                <div className="task-owner">{card.owner}</div>
                                </div>
                            ))}
                            <button className="add-task-btn">+</button>
                        </div>
                    </div>
            ))}
            </div>
        </div>
    );

}