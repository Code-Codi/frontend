import styled from "styled-components";
import { LocalDateTime, DateTimeFormatter } from "js-joda";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: white;
  border: 0.5px solid #b1b1b1;
  padding: 25px;
  max-width: 500px;
  width: 100%;
  z-index: 1000;
  min-height: 365px;
  padding-bottom: 70px;
`;

const MainTitle = styled.div`
  color: #343c6a;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ScheduleItem = styled.div`
  margin-bottom: 12px;
  cursor: pointer;
`;

const ScheduleTitle = styled.div`
  color: #343c6a;
  font-size: 20px;
  font-weight: 400;
`;

const DateText = styled.div`
  color: rgba(52, 60, 106, 0.5);
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 8px;
`;

const AddButton = styled.div`
  position: absolute;
  right: 30px;
  bottom: 15px;
  color: #343c6a;
  font-size: 48px;
  cursor: pointer;
`;

const formatDate = (localDateTime) => {
  return `${localDateTime.monthValue()}월 ${localDateTime.dayOfMonth()}일`;
};

const ScheduleListModal = ({
  startDate,
  selectedSchedules,
  onAdd,
  onClose,
  onScheduleClick,
}) => {
  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <MainTitle>{formatDate(startDate)}</MainTitle>
        {selectedSchedules.map((schedule, index) => (
          <ScheduleItem key={index} onClick={() => onScheduleClick(schedule)}>
            <ScheduleTitle>{schedule.title}</ScheduleTitle>
            <DateText>
              {formatDate(LocalDateTime.parse(schedule.startDate))}
              {LocalDateTime.parse(schedule.startDate).equals(
                LocalDateTime.parse(schedule.endDate)
              )
                ? ""
                : ` ~ ${formatDate(LocalDateTime.parse(schedule.endDate))}`}
            </DateText>
          </ScheduleItem>
        ))}
        <AddButton onClick={onAdd}>+</AddButton>
      </ModalContainer>
    </Overlay>
  );
};

export default ScheduleListModal;
