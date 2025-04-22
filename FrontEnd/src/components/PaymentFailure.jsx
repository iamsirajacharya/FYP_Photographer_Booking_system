import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/user/dashboard");
    }, 3000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-4">
          There was an issue processing your payment. Please try again or
          contact support.
        </p>
        <button
          onClick={() => navigate("/user/dashboard")}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Failure;
