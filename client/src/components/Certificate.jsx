import React from 'react';
import Modal from 'react-modal';

const Certificate = ({ isOpen, onClose, certificateUrl }) => {
  // Path to your certificate template image
  const imagePath = `https://marketplace.canva.com/EAFMEhTdZhk/1/0/1600w/canva-modern-appreciation-certificate-PagvQb6WD0s.jpg`;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Certificate"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold mb-4">Your Certificate</h2>
      <div>
        <img src={imagePath} alt="Certificate Template" className="w-full mb-4" />
        <iframe src={certificateUrl} width="100%" height="500px" title="Certificate" />
        <a
          href={certificateUrl}
          download="certificate.pdf"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          
        </a>
      </div>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Close
      </button>
    </Modal>
  );
};

export default Certificate;
