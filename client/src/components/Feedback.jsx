import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FeedbackForm() {
  const [userName, setUserName] = useState('');
  const [centerName, setCenterName] = useState('');
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleCenterNameChange = (event) => {
    setCenterName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/feedback`, { userName, centerName, answers });
      const certificateUrl = response.data.certificateUrl;

      // Navigate to the CertificatePage component
      navigate('/certificate', { state: { certificateUrl } });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Feedback Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={handleUserNameChange}
              className="px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Center Name</label>
            <input
              type="text"
              value={centerName}
              onChange={handleCenterNameChange}
              className="px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {[1, 2, 3, 4].map((q) => (
            <div key={q} className="p-4 border rounded shadow-md bg-white mb-4">
              <label className="mb-2 font-semibold text-gray-800">Question {q}</label>
              <div className="flex flex-col space-y-2 mt-2">
                {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`question${q}`}
                      value={`option${index + 1}`}
                      onChange={handleInputChange}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
