import { useContext } from "react";
import { AppContext } from "../AppContext";

const BackButton = () => {
  const { navigate } = useContext(AppContext);

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-4 mt-4"
      aria-label="Go back"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;

