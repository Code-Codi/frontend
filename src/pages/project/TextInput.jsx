import React, { useState } from 'react';

export default function TextInput({ init }) {
  const [text, setText] = useState(init);
  const [editable, setEditable] = useState(false);

  const handleDoubleClick = () => setEditable(true);
  const handleChange = (e) => setText(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') setEditable(false);
  };

  return editable ? (
    <input
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => setEditable(false)}
      autoFocus
    />
  ) : (
    <span onClick={handleDoubleClick}>{text}</span>
  );
}
