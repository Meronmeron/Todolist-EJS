import React, { useState, useRef } from "react";
import { HiArrowNarrowRight, HiArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import "./Modal.css";

const Modalpopup: React.FC = () => {
  const [modalShow, setModalShow] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleModal = () => {
    console.log('here');
    setModalShow(!modalShow);
  };

  const handleNextClick = () => {
    // Logic here to navigate to the next video or perform any other action
    console.log('Next video clicked');
  };

  const handleVideoEnd = () => {
    console.log('Video ended');
    setVideoEnded(true);
  };

  return (
    <>
      <div className="video-container">
        <HiArrowNarrowLeft className={`arrow left-arrow ${videoEnded ? 'show' : 'hide'}`} />
        <div className="video-wrapper">
          <video ref={videoRef} onEnded={handleVideoEnd} width="640" height="360" controls={false} onClick={() => videoRef.current?.play()}>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className={`like-dislike-wrapper ${videoEnded ? 'show' : 'hide'}`}>
            <AiOutlineLike className="like-icon" />
            <AiOutlineDislike className="dislike-icon" />
          </div>
        </div>
        <HiArrowNarrowRight className={`arrow right-arrow ${videoEnded ? 'show' : 'hide'}`} onClick={handleNextClick} />
      </div>
      {modalShow && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}>
            <div className="icon-container">
              {/* Any additional icons or content for the modal */}
            </div>
            <div className="modal-content">
              <h1>Subscribe here</h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modalpopup;




// function VideoPlayer() {
//     const videoRef = useRef(null);
  
//     const handleVideoEnd = () => {
//       console.log('Video ended');
//       // Perform any actions you need when the video ends
//     };
  
//     return (
//       <div>
//         <video ref={videoRef} onEnded={handleVideoEnd}>
//           <source src="your-video-source.mp4" type="video/mp4" />
//         </video>
//       </div>
//     );
//   }