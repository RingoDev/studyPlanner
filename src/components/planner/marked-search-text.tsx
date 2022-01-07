import React from "react";

interface Props {
  text: string;
  searchText: string;
}

const MarkedSearchText: React.FC<Props> = ({ text, searchText }) => {
  if (searchText.trim().length === 0) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${searchText})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </span>
  );
};
export default MarkedSearchText;
