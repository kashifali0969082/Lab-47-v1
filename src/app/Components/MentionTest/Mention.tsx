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
  const [mentionAdded, setMentionAdded] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sample Users List
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
    setText(newText); //input value

    // Allow mention only at the beginning and if not already added
    if (mentionAdded) return;

    const cursorPos = e.target.selectionStart;
    const beforeCursor = newText.substring(0, cursorPos);

    // Check if the mention is at the start or after spaces
    if (/^\s*@\w*$/.test(beforeCursor)) {
      const query = beforeCursor.slice(1).toLowerCase();
      setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
      setShowDropdown(true);
      setMentionStart(cursorPos - beforeCursor.length);
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
    setMentionAdded(true); // Prevents multiple mentions

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = beforeMention.length + user.name.length + 2;
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div style={{ position: "relative", width: "400px" }}>
      {/* Textarea */}
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
          whiteSpace: "pre-wrap",
        }}
      />

      {/* Display text with mention styling */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          padding: "10px",
          fontSize: "16px",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          color: "transparent",
          overflow: "hidden",
        }}
      >
        {text.split(" ").map((word, index) =>
          word.startsWith("@") && index === 0 ? (
            <span key={index} style={{ color: "red", fontWeight: "bold" }}>
              {word}{" "}
            </span>
          ) : (
            <span key={index}>{word} </span>
          )
        )}
      </div>

      {/* Dropdown for user mentions */}
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
