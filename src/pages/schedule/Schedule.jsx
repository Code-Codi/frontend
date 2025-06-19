import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { LocalDate, LocalDateTime } from "js-joda";
import { useLocation } from "react-router-dom";
import ScheduleListModal from "../../components/schedule/modal/ScheduleListModal";
import ScheduleCreateModal from "../../components/schedule/modal/ScheduleCreateModal";
import ScheduleDeleteModal from "../../components/schedule/modal/ScheduleDeleteModal";
import ScheduleDetailModal from "../../components/schedule/modal/ScheduleDetailModal";
import { getSchedule } from "../../api/schedule/scheduleAPI";

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 110px 70px 0 320px;
  background: #f5f7fa;
`;

const ScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  color: #343c6a;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: #343c6a;
  font-size: 22px;
  cursor: pointer;
  padding: 20px;

  &:first-child {
    padding-left: 0;
  }
`;

const MonthText = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const WeekRow = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #e8e8e8;
  align-items: stretch;
  background: white;

  &:last-child {
    border-top: none;
  }
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 14.28%;
  padding: 4px;
  height: ${({ isHeader }) => (isHeader ? "30px" : "130px")};
  font-size: 16px;
  color: ${({ isDay }) => (isDay ? "#333" : "#969696")};
  border-right: 1px solid #e8e8e8;
  cursor: ${({ isDay }) => (isDay ? "pointer" : "default")};
  position: relative;
  overflow: visible;
  background: white;

  &:last-child {
    border-right: none;
  }
`;

const DayLabel = styled.p`
  font-size: 17px;
  margin: 0;
  font-weight: 500;
`;

const ScheduleItem = styled.div`
  background: #7875f7;
  font-size: 13px;
  width: ${({ width }) => width};
  height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 2px;
  position: absolute;
  top: ${({ line }) => line * 25 + 35}px;
  left: 0;
  box-sizing: border-box;
`;

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalType, setModalType] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cellWidth, setCellWidth] = useState(100);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);

  const firstCellRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamId = queryParams.get("teamId");
  const currentYear = currentDate.getFullYear();

  const updateCellWidth = () => {
    if (firstCellRef.current) {
      const newWidth = firstCellRef.current.offsetWidth;
      setCellWidth((prevWidth) =>
        prevWidth !== newWidth ? newWidth : prevWidth
      );
    }
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await getSchedule(
          teamId,
          currentYear,
          currentDate.getMonth() + 1
        );

        setScheduleData(data.result); // 데이터만 세팅
      } catch (error) {
        console.error("스케줄 로딩 실패:", error);
      }
    };

    fetchScheduleData(); // 데이터 불러오기

    updateCellWidth();
    window.addEventListener("resize", updateCellWidth);
    return () => window.removeEventListener("resize", updateCellWidth);
  }, [currentDate]);

  const navigateToPreviousMonth = () =>
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
    );

  const navigateToNextMonth = () =>
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1)
    );

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getLastDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const createScheduleWeeks = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const daysArray = Array(firstDay)
      .fill(null)
      .concat(Array.from({ length: lastDay }, (_, i) => i + 1));
    while (daysArray.length % 7 !== 0) daysArray.push(null);

    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      weeks.push(daysArray.slice(i, i + 7));
    }
    return weeks;
  };

  const weeks = createScheduleWeeks();
  const globalLineMapRef = useRef(new Map());

  const getScheduleItemsForDate = (schedules) => {
    const placedSchedules = [];
    const scheduleItems = [];
    const lineMap = globalLineMapRef.current;

    schedules.forEach((schedule) => {
      const startDate = LocalDateTime.parse(schedule.startDate).toLocalDate();
      const endDate = LocalDateTime.parse(schedule.endDate).toLocalDate();
      const scheduleId = `${schedule.title}-${startDate}-${endDate}`;

      let line;
      if (lineMap.has(scheduleId)) {
        line = lineMap.get(scheduleId);
      } else {
        // 줄 번호 새로 계산
        const usedLines = new Set();
        placedSchedules.forEach((placed) => {
          if (
            !(
              endDate.isBefore(placed.startDate) ||
              startDate.isAfter(placed.endDate)
            )
          ) {
            usedLines.add(placed.line);
          }
        });

        line = 0;
        while (usedLines.has(line)) {
          line++;
        }
        lineMap.set(scheduleId, line);
      }

      placedSchedules.push({ line, startDate, endDate });
      scheduleItems.push({ title: schedule.title, line, startDate, endDate });
    });

    return { scheduleItems };
  };

  const isWithinRange = (dateObj, item) => {
    const startDate = item.startDate;
    const endDate = item.endDate;
    const start = new Date(
      startDate.year(),
      startDate.monthValue() - 1,
      startDate.dayOfMonth()
    );
    const end = new Date(
      endDate.year(),
      endDate.monthValue() - 1,
      endDate.dayOfMonth()
    );

    return dateObj >= start && dateObj <= end;
  };

  const handleDayClick = (day) => {
    if (day !== null) {
      const clickedDate = LocalDateTime.of(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        day,
        0,
        0,
        0
      );
      setSelectedDate(clickedDate);

      const selectedSchedules = scheduleData.filter((schedule) => {
        const startDate = LocalDateTime.parse(schedule.startDate).toLocalDate();
        const endDate = LocalDateTime.parse(schedule.endDate).toLocalDate();

        return (
          clickedDate.toLocalDate().equals(startDate) ||
          clickedDate.toLocalDate().equals(endDate) ||
          (clickedDate.toLocalDate().isAfter(startDate) &&
            clickedDate.toLocalDate().isBefore(endDate))
        );
      });

      setSelectedSchedule(selectedSchedules);
      setIsModalOpen(true);
    }
  };

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setModalType("create");
  };

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setModalType("edit");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("list");
  };

  const handleDeleteClick = () => {
    setModalType("delete");
  };

  const updateScheduleData = async () => {
    try {
      const data = await getSchedule(
        teamId,
        currentYear,
        currentDate.getMonth() + 1
      );
      setScheduleData(data.result);
    } catch (error) {}
  };

  const handleDeleteSuccess = () => {
    updateScheduleData();
  };

  const handleSaveSuccess = () => {
    updateScheduleData();
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setModalType("detail");
  };

  return (
    <ScheduleContainer>
      <ScheduleHeader>
        <ArrowButton onClick={navigateToPreviousMonth}>{"<"}</ArrowButton>
        <MonthText>{`${currentYear}.${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`}</MonthText>
        <ArrowButton onClick={navigateToNextMonth}>{">"}</ArrowButton>
      </ScheduleHeader>

      <WeekRow>
        {daysOfWeek.map((day, index) => (
          <DayCell key={index} isHeader>
            <DayLabel>{day}</DayLabel>
          </DayCell>
        ))}
      </WeekRow>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex}>
          <WeekRow>
            {week.map((day, dayIndex) => {
              const isFirstCell = weekIndex === 0 && dayIndex === 0;
              const ref = isFirstCell ? firstCellRef : null;

              return (
                <DayCell
                  key={dayIndex}
                  isDay={day !== null}
                  onClick={() => handleDayClick(day)}
                  ref={ref}
                >
                  {day !== null && <DayLabel>{day}</DayLabel>}

                  {day !== null &&
                    (() => {
                      const dateObj = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      );
                      const { scheduleItems } =
                        getScheduleItemsForDate(scheduleData);
                      const filteredItems = scheduleItems.filter((item) =>
                        isWithinRange(dateObj, item)
                      );
                      return (
                        <>
                          {filteredItems
                            .filter((item) => item.line < 4)
                            .map((item, idx) => {
                              const showTitle = item.startDate.equals(
                                LocalDate.of(
                                  dateObj.getFullYear(),
                                  dateObj.getMonth() + 1,
                                  dateObj.getDate()
                                )
                              );

                              const isEndOrSaturday =
                                LocalDate.of(
                                  dateObj.getFullYear(),
                                  dateObj.getMonth() + 1,
                                  dateObj.getDate()
                                ).equals(item.endDate) ||
                                dateObj.getDay() === 6;

                              return (
                                <ScheduleItem
                                  key={idx}
                                  width={`${
                                    isEndOrSaturday ? cellWidth - 2 : cellWidth
                                  }px`}
                                  line={item.line}
                                >
                                  {showTitle && item.title}
                                </ScheduleItem>
                              );
                            })}
                        </>
                      );
                    })()}
                </DayCell>
              );
            })}
          </WeekRow>
        </div>
      ))}
      {isModalOpen && (
        <>
          {modalType === "list" && (
            <ScheduleListModal
              startDate={selectedDate}
              selectedSchedules={selectedSchedule}
              onClose={handleCloseModal}
              onAdd={handleAddClick}
              onScheduleClick={handleScheduleClick}
            />
          )}
          {modalType === "create" && (
            <ScheduleCreateModal
              selectedDate={selectedDate}
              onClose={handleCloseModal}
              mode="create"
              onSaveSuccess={handleSaveSuccess}
            />
          )}
          {modalType === "edit" && (
            <ScheduleCreateModal
              selectedDate={selectedDate}
              onClose={handleCloseModal}
              mode="edit"
              schedule={selectedSchedule}
              onSaveSuccess={handleSaveSuccess}
            />
          )}
          {modalType === "delete" && (
            <ScheduleDeleteModal
              scheduleId={selectedSchedule.id}
              onClose={handleCloseModal}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
          {modalType === "detail" && (
            <ScheduleDetailModal
              schedule={selectedSchedule}
              onClose={handleCloseModal}
              onDelete={handleDeleteClick}
              onEdit={() => handleEditClick(selectedSchedule)}
            />
          )}
        </>
      )}
    </ScheduleContainer>
  );
};

export default Schedule;
