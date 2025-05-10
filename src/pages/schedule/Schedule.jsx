import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { LocalDate, LocalDateTime } from "js-joda";

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 70px 0 310px;
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
  font-size: 20px;
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
  top: ${({ line }) => line * 25 + 30}px;
  left: 0;
  box-sizing: border-box;
`;

const OverflowLabel = styled.div`
  font-size: 15px;
  position: absolute;
  top: ${({ line }) => line * 25 + 25}px;
  padding-left: 5px;
  box-sizing: border-box;
  height: 22px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: center;
`;

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [cellWidth, setCellWidth] = useState(100);

  const firstCellRef = useRef(null);

  useEffect(() => {
    const updateCellWidth = () => {
      if (firstCellRef.current) {
        setCellWidth(firstCellRef.current.offsetWidth);
      }
    };

    updateCellWidth();
    window.addEventListener("resize", updateCellWidth);
    return () => window.removeEventListener("resize", updateCellWidth);
  }, []);

  // 임시 데이터
  const scheduleData = [
    {
      startDate: LocalDateTime.parse("2025-05-12T17:00:00"),
      endDate: LocalDateTime.parse("2025-05-13T18:00:00"),
      title: "겹치는 일정 4",
    },
    {
      startDate: LocalDateTime.parse("2025-05-13T18:00:00"),
      endDate: LocalDateTime.parse("2025-05-21T19:00:00"),
      title: "겹치는 일정 3",
    },
    {
      startDate: LocalDateTime.parse("2025-05-15T18:00:00"),
      endDate: LocalDateTime.parse("2025-05-21T19:00:00"),
      title: "겹치는 일정 5",
    },
    {
      startDate: LocalDateTime.parse("2025-05-15T18:00:00"),
      endDate: LocalDateTime.parse("2025-05-21T19:00:00"),
      title: "겹치는 일정 5",
    },
    {
      startDate: LocalDateTime.parse("2025-05-15T18:00:00"),
      endDate: LocalDateTime.parse("2025-05-21T19:00:00"),
      title: "겹치는 일정 5",
    },
    {
      startDate: LocalDateTime.parse("2025-05-15T18:00:00"),
      endDate: LocalDateTime.parse("2025-05-21T19:00:00"),
      title: "겹치는 일정 5",
    },
  ];

  const navigateToPreviousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  const navigateToNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
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

  const getScheduleItemsForDate = (schedules) => {
    const placedSchedules = [];
    const scheduleItems = [];

    schedules.forEach((schedule) => {
      const startDate = schedule.startDate.toLocalDate();
      const endDate = schedule.endDate.toLocalDate();

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

      let line = 0;
      while (usedLines.has(line)) {
        line++;
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

  const currentYear = currentDate.getFullYear();
  const weeks = createScheduleWeeks();

  const handleDayClick = (day) => {
    if (day !== null) setIsModalOpen(true);
  };

  return (
    <div>
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
                            {filteredItems.slice(0, 3).map((item, idx) => {
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
                            {filteredItems.length > 3 && (
                              <OverflowLabel width={`${cellWidth}px`} line={3}>
                                ...
                              </OverflowLabel>
                            )}
                          </>
                        );
                      })()}
                  </DayCell>
                );
              })}
            </WeekRow>
          </div>
        ))}
      </ScheduleContainer>
    </div>
  );
};

export default Schedule;
