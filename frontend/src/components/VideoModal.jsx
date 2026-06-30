import React from 'react';
import ReactPlayer from 'react-player';
import { IoMdClose } from 'react-icons/io';

const VideoModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>
          <IoMdClose size={30} />
        </button>
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={trailerUrl}
            width="100%"
            height="100%"
            playing={true}
            controls={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
