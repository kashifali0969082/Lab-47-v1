"use client"
import React, { useState, useRef } from "react";

interface User {
  id: number;
  name: string;
}

const MentionTextarea: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sample User List
  const users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
  ];

  // Handle Text Change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    const cursorPos = e.target.selectionStart;
    const beforeCursor = newText.substring(0, cursorPos);
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];

    // Detect @ mention only at the beginning or after spaces
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      const query = lastWord.slice(1).toLowerCase();
      setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
      setShowDropdown(true);
      setMentionStart(cursorPos - lastWord.length);
    } else {
      setShowDropdown(false);
      setMentionStart(null);
    }
  };

  // Handle Mention Selection
  const handleSelectUser = (user: User) => {
    if (mentionStart === null || textareaRef.current === null) return;

    const beforeMention = text.substring(0, mentionStart);
    const afterMention = text.substring(textareaRef.current.selectionStart);
    const newText = `${beforeMention}@${user.name} ${afterMention}`;
    setText(newText);
    setShowDropdown(false);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = beforeMention.length + user.name.length + 2;
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div style={{ position: "relative", width: "400px" }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Type @ to mention someone..."
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
          color:'black'
        }}
      />

      {showDropdown && filteredUsers.length > 0 && (
        <ul
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            padding: "5px",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
            marginTop: "-5px",
          }}
        >
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "#f8f8f8",
                borderBottom: "1px solid #ddd",
              }}
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentionTextarea;
