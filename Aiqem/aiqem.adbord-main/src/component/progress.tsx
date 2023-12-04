// Progress.js
import React, { useState, useEffect } from 'react';

interface ProgressProps {
  onLoaded: () => void;
  setProgress: Function;
  progress: number;
  reloadProgress: boolean;
}

const Progress: React.FC<ProgressProps> = ({ onLoaded, reloadProgress, setProgress, progress }) => {
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let tempProgress = progress
      if (tempProgress >= 100) {
        clearInterval(interval);
        onLoaded();
        setProgress(100)
        return 100;
      }
      tempProgress += 1
      setProgress(tempProgress)
      return tempProgress + 1;
      // setProgress(prevProgress => {
      //   if (prevProgress >= 100) {
      //     clearInterval(interval);
      //     onLoaded();
      //     return 100;
      //   }
      //   return prevProgress + 1;
      // });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoaded]);

  useEffect(() => {
    if (reloadProgress) {
      setProgress(0);
    }
  }, [reloadProgress]);

  return (
    <div className='flex justify-center mt-5'>
      <div style={{ border: '1px solid #ccc', width: '320px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '3px',
            backgroundColor: '#B1B1B1',
          }}
        />
      </div>
    </div>
  );
};

export default Progress;

