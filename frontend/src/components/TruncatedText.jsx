import { useState } from "react";

const TruncatedText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const visibleText = isExpanded ? text : text.slice(0, maxLength);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <p className="text-sm leading-relaxed">
      {visibleText}
      {shouldTruncate && (
        <span>
          {!isExpanded ? "..." : ""}
          <button
            onClick={toggleExpand}
            className="ml-1 text-primary hover:underline font-medium text-sm"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </span>
      )}
    </p>
  );
};

export default TruncatedText;
