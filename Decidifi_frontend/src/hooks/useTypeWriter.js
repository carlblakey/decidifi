import { useEffect, useState } from "react";

// Custom hook for typing effect
const useTypewriter = (word, delay) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayText(word.substring(0, index - 1));
          setIndex((prevIndex) => prevIndex - 1);
        } else {
          setDisplayText(word.substring(0, index + 1));
          setIndex((prevIndex) => prevIndex + 1);
        }

        // When word is fully typed, wait and then start deleting
        if (!isDeleting && index === word.length) {
          setTimeout(() => setIsDeleting(true), delay);
        }

        // When word is fully deleted, start typing again
        if (isDeleting && index === 0) {
          setIsDeleting(false);
        }
      },
      isDeleting ? 100 : 200
    );

    return () => clearTimeout(timer);
  }, [index, isDeleting, word, delay]);

  return displayText;
};

export default useTypewriter;