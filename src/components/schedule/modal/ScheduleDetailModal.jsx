import styled from "styled-components";
import { ReactComponent as TimeIcon } from "../../../assets/time.svg";
import { ReactComponent as TrashIcon } from "../../../assets/trash.svg";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

const TitleText = styled.div`
  color: #343c6a;
  font-size: 24px;
  font-family: Inter;
  font-weight: 600;
  word-wrap: break-word;
  margin-bottom: 15px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
`;

const DateText = styled.div`
  color: #343c6a;
  font-size: 18px;
  font-family: Inter;
  font-weight: 400;
  word-wrap: break-word;
`;

const MemoText = styled.div`
  color: #343c6a;
  font-size: 20px;
  font-family: Inter;
  font-weight: 400;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin: 20px 0;
`;

const IconContainer = styled.div`
  display: flex;
  position: absolute;
  gap: 18px;
  justify-content: flex-end;
  right: 25px;
  bottom: 25px;
`;

const ScheduleDetailModal = ({ schedule, onClose, onDelete, onEdit }) => {
  const startFormatted = format(schedule.startDate, "yyyy.MM.dd a h:mm", {
    locale: ko,
  });
  const endFormatted = format(schedule.endDate, "yyyy.MM.dd a h:mm", {
    locale: ko,
  });

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <TitleText>{schedule.title}</TitleText>
        <DateContainer>
          <TimeIcon />
          <DateText>
            {startFormatted} ~ {endFormatted}
          </DateText>
        </DateContainer>
        <MemoText>{schedule.content}</MemoText>
        <IconContainer>
          <EditIcon onClick={onEdit} />
          <TrashIcon onClick={onDelete} />
        </IconContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ScheduleDetailModal;
