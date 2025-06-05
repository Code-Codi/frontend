export default function CommentRow({ comment, onDelete }) {
  const currentUserId = Number(localStorage.getItem('userId'));

  return (
    <tr className="border-b text-sm">
      <td className="py-2 px-2 font-medium text-gray-800 whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">
        {comment.writerName}
      </td>
      <td className="py-2 px-2 text-gray-700 break-words">{comment.content}</td>
      <td className="py-2 px-2 text-gray-500 whitespace-nowrap">
        {comment.createdAt?.slice(0, 10)}
      </td>
      <td>
          <button
            onClick={() => onDelete(comment.id)}
            style={{ marginLeft: '8px' }}
          >
            삭제
          </button>
      </td>
    </tr>
  );
}
