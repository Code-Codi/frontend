import { useState, useEffect } from "react";
import { getPopular, getPosts } from "../../api/board/board";
import PopularCard from "../../components/board/PopularCard";
import PostRow from "../../components/board/PostRow";
import { Link, useLocation } from "react-router-dom";

export default function BoardList({ boardType }) {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [popular, setPopular] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const { pathname } = useLocation();
  // const role = localStorage.getItem('role'); // 'USER' or 'PROFESSOR'
  const isGuide = boardType === "GUIDE";

  // const canWrite = isGuide ? role === 'PROFESSOR' : true;

  useEffect(() => {
    getPosts(boardType.toUpperCase(), page - 1).then((res) => {
      const result = res.data.result;

      if (result && Array.isArray(result.content)) {
        setPosts(result.content);
        setTotalPages(result.totalPages ?? 1);
      } else if (Array.isArray(result)) {
        setPosts(result);
        setTotalPages(1);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    });
  }, [boardType, page]);

  useEffect(() => {
    if (!isGuide) {
      getPopular().then((res) => {
        setPopular(res.data.result);
      });
    }
  }, [isGuide]);

  const tabs = ["all"];

  return (
    <section
      style={{
        padding: "6px 54px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      {/* 인기글 */}
      {!isGuide && (
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
            오늘의 인기 Top 3
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              marginTop: "16px",
            }}
          >
            {popular?.length > 0 &&
              popular.map((p) => <PopularCard key={p.id} post={p} />)}
          </div>
        </div>
      )}

      {/* 최근 게시물 */}
      <div>
        {isGuide && (
          <h2
            style={{ fontSize: "22px", color: "#343C6A", fontWeight: "bold" }}
          >
            가이드라인
          </h2>
        )}

        {!isGuide && (
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>최근 게시물</h2>
        )}

        {/* 탭 메뉴 (가이드 게시판에서는 제외) */}
        {!isGuide && (
          <div
            style={{
              display: "flex",
              gap: "24px",
              borderBottom: "1px solid #e6eff5",
              marginBottom: "16px",
              marginTop: "12px",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPage(1);
                }}
                style={{
                  paddingBottom: "8px",
                  border: "none",
                  background: "none",
                  fontWeight: tab === t ? "600" : "400",
                  borderBottom: tab === t ? "2px solid #1814F3" : "none",
                  color: tab === t ? "#1814F3" : "#718EBF",
                  cursor: "pointer",
                }}
              >
                {t === "all" ? "All" : t.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* 게시글 테이블 */}
        <table
          style={{
            width: "100%",
            fontSize: "14px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#718EBF" }}>
              <th style={{ padding: "12px", width: "40%" }}>Title</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Visitors</th>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Favorites</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <PostRow key={p.id} post={p} boardType={boardType} />
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "16px",
    }}
  >
    {[...Array(totalPages)].map((_, idx) => {
      const num = idx + 1;
      const isActive = num === page;
      return (
        <button
            key={num}
            onClick={() => setPage(num)}
            style={{
              background: isActive ? "#1814f3" : "#fff",
              color: isActive ? "#fff" : "#000",
              border: "1px solid #ccc",
              padding: "8px 14px",
              margin: "0 4px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {num}
          </button>
        );
      })}
    </div>


      {/* 글쓰기 버튼 */}
      {/* {canWrite && ( */}
      <div
      style={{
    display: "flex",
    justifyContent: "flex-end", 
    marginTop: "16px",
  }}
      >
        <Link
          to={`${pathname}/write`}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1814F3",
            color: "white",
            fontSize: "20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          +
        </Link>
      </div>
      {/* )} */}
    </section>
  );
}
