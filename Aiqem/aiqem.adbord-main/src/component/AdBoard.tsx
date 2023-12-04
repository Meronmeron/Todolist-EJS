import { useState, useEffect } from "react";
import img1 from '../ads/ad1.svg';
import img2 from '../ads/ad2.svg';
import img3 from '../ads/ad3.svg';
import leftaro from '../icon/arrow-leftw.svg';
import rightaro from '../icon/arrow-right.svg';
import { Image, message } from 'antd';
import thumbsdown from '../icon/thumbs-down.svg';
import thumbsdowna from '../icon/thumbsdowna.svg';
import tumbsup from '../icon/thumbs-up.svg';
import tumbsupa from '../icon/thumbs-upa.svg';
import callUs from '../icon/call_us.svg';
import visitWebsite from '../icon/visit_website.svg';

import { useSwipeable } from 'react-swipeable';
import Progress from '../component/progress';
import Loading from "../util/Loading";
import make_request from "../util/util";
import Resizer from "react-image-file-resizer";
import axios from 'axios'

// const images = [img1, img2, img3];

type AdBoardProps = {
  setIsSuccess: Function
  data: any
  setErrorMessage: Function
}


const AdBoard: React.FC<AdBoardProps> = ({ setIsSuccess, data, setErrorMessage }) => {

  const [activeButton, setActiveButton] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [isRightButtonLoading, setRightButtonLoading] = useState(false)
  const [isLeftButtonLoading, setLeftButtonLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState([false, false, false, false])
  const [isActionActive, setIsActionActive] = useState(true)
  const [images, setImages] = useState<any>([])
  const [currentCreativesList, setCurrentCreativesList] = useState<any>([])
  const [progress, setProgress] = useState<number>(0);


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    getAds()
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const returnBoolean = (index: any) => {
    let length = 4
    let array = Array.from({ length }, () => false)
    if (index !== null) array[index] = true
    return array
  }

  const getAds = async () => {
    setIsLoading(true)
    const response = await make_request(`individual/individual_post_for_web/${data.channel_id}`, data.token, "POST", { "bot_token": data.bot_token })
    if (response[0] === null) {
      let creatives = response[1]
      if (creatives.length > 0) {
        let tempImagesList = creatives.map((creative: any) => creative.ad_creative.photo_url)
        setCurrentCreativesList([...creatives])
        setImages([...images, ...tempImagesList])
        // for (let imageURL of tempImagesList) {
        //   let imageFile = await getImageBlobFromUrl(imageURL)
        //   if(imageFile !== null){
        //     resizeImage(imageURL)
        //   }
        // }
        // console.log(tempImagesList)
      } else {
        setErrorMessage("No more ads for you today, please come back later! 🕒")
        setIsSuccess(false)
      }
    } else {
      setIsSuccess(false)
    }
    // console.log(response)
    setIsLoading(false)
  }



  const handleButtonClickUp = async () => {
    if (isActionActive && activeButton !== 'thumbsUp') {
      setActiveButton('thumbsUp');
      setIsActionLoading(returnBoolean(1))
      setIsActionActive(false)

      await submitViewAndOrReaction("LIKE")

      setIsActionLoading(returnBoolean(null))
      setIsActionActive(true)
    }
  };

  const handleButtonClickDown = async () => {
    if (isActionActive && activeButton !== 'thumbsDown') {
      // console.log(currentCreativesList[activeImageIndex])

      setActiveButton('thumbsDown');
      setIsActionLoading(returnBoolean(0))
      setIsActionActive(false)

      await submitViewAndOrReaction("DISLIKE")

      setIsActionLoading(returnBoolean(null))
      setIsActionActive(true)
    }
  };

  const handleLeftButtonClick = async () => {
    setLeftButtonLoading(true)
    setIsActionActive(false)


    await submitViewAndOrReaction("CLICKED_LEFT")

    setLeftButtonLoading(false)
    setIsActionActive(true)


    setActiveImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setActiveButton('')
    setProgress(0)
    setReloadProgress(true)
    setProgressLoaded(false)
  };

  const handleRightButtonClick = async () => {
    setRightButtonLoading(true)
    setIsActionActive(false)


    await submitViewAndOrReaction("CLICKED_RIGHT")

    if (activeImageIndex === images.length - 1) {
      await getAds()
    }

    setRightButtonLoading(false)
    setIsActionActive(true)


    setActiveImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setActiveButton('')
    setProgress(0)
    setReloadProgress(true)
    setProgressLoaded(false)
  };

  const handleLeftSwipe = () => {
    setActiveImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleRightSwipe = () => {
    setActiveImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };


  const handlers = useSwipeable({
    onSwipedLeft: handleRightSwipe,
    onSwipedRight: handleLeftSwipe
  });



  const visitWebClicked = async () => {
    if (isActionActive) {
      setIsActionLoading(returnBoolean(2))
      setIsActionActive(false)

      await submitViewAndOrReaction("WEBSITE_URL")

      setIsActionLoading(returnBoolean(null))
      setIsActionActive(true)

      window.open('https://www.google.com', '_blank');
    }
  }

  const callUsClicked = async () => {
    if (isActionActive) {

      setIsActionLoading(returnBoolean(3))
      setIsActionActive(false)

      await submitViewAndOrReaction("CALL")

      setIsActionLoading(returnBoolean(null))
      setIsActionActive(true)

      const phoneNumber = '+1234567890';

      const telURI = 'tel:' + phoneNumber;

      window.open(telURI);
    }
  }

  const submitViewAndOrReaction = async (reaction: any) => {
    let requestBody: any = {
      "post_creative_id": currentCreativesList[activeImageIndex].post_creative_id,
      "channel_id": currentCreativesList[activeImageIndex].channel_id,
      "bot_id": currentCreativesList[activeImageIndex].bot_id,
      "message_id": "0",
    }
    if (reaction !== null) {
      requestBody['reaction'] = reaction
    }

    const response = await make_request(`individual/save_posted_ad_for_individual_web`, data.token, "POST", requestBody)
    if (response[0] !== null) {
      message.error(response[0])
    } else {
      let earningRequestBody: any = {
        "post_creative_id": currentCreativesList[activeImageIndex].post_creative_id,
        "channel_id": currentCreativesList[activeImageIndex].channel_id,
        "payment_mode_key": "per_view"
      }
      const earningResponse = await make_request(`posted_ads/individual_earnings`, data.token, "POST", earningRequestBody)
      if (earningResponse[0] !== null) {
        // console.error(earningResponse[0])
      }
    }
  }

  return (
    <div className="">
      {
        (isLoading && images.length == 0) ? <div className="absolute" style={{ top: '50%', left: '50%' }}>
          <Loading size='medium' />
        </div> :
          <>
            <div className="ml-5 flex justify-center w-full">
              <Progress
                progress={progress}
                setProgress={setProgress}
                onLoaded={() => setProgressLoaded(true)} reloadProgress={reloadProgress} />
            </div>
            <div className='justify-center'>
              {/* {images.length > 0 && <img className='rounded-[15px]' src={images[activeImageIndex]} alt='image' />} */}
              {
                images.length > 0 &&
                <>
                  <div style={{
                    height: `${windowSize.height * .70}`,
                    width: `${windowSize.width * .88}`
                  }} className="blur-2xl">
                    <Image
                      className='object-cover'
                      height={windowSize.height * .70}
                      width={windowSize.width * .88}
                      src={images[activeImageIndex]}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                  <div className="absolute mx-5 flex justify-center mt-3" style={{ top: '15%', left: '0%' }}>
                    <Image
                      className='object-contain'
                      height={windowSize.height * .70}
                      width={windowSize.width * .88}
                      src={images[activeImageIndex]}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                </>
              }

            </div>
            <button
              id='leftaro'
              onClick={() => {
                handleLeftButtonClick();
                // handleLeftSwipe();
              }}
              style={{ visibility: progressLoaded ? 'visible' : 'hidden' }}
            >
              <div className='absolute' style={{ top: '53%', left: '1%' }}>
                <div className='horizontalScroll w-[53px] h-[51px]'>
                  <div className='absolute mt-3 ml-3'>
                    {
                      isLeftButtonLoading ?
                        <div className="absolute ml-3 mt-3" style={{ top: '50%' }}>
                          <Loading size='small' />
                        </div>
                        : <img src={leftaro} alt='right slider' />
                    }
                  </div>
                </div>
              </div>
            </button>
            <button
              id='rightaro'
              onClick={() => {
                handleRightButtonClick();
                // handleRightSwipe();
              }}
              style={{ visibility: progressLoaded ? 'visible' : 'hidden' }}
            >
              <div className='absolute flex' style={{ top: '53%', right: '1%' }}>
                <div className='horizontalScroll w-[53px] h-[51px]'>
                  <div className='absolute mt-3 ml-3'>
                    {
                      isRightButtonLoading ?
                        <div className="absolute ml-3 mt-3" style={{ top: '50%' }}>
                          <Loading size='small' />
                        </div>
                        : <img src={rightaro} alt='left slider' />
                    }
                  </div>
                </div>
              </div>
            </button>
            {/* <div className='' style={{ bottom: '0.5%' }}> */}
            <div className="flex flex-row justify-around">
              <div className='absolute reactionButton w-[73px] h-[71px] flex justify-center items-center' style={{ bottom: '0.5%', left: '10%' }}>
                <button onClick={handleButtonClickDown} className={activeButton === 'thumbsDown' ? 'active' : ''}>
                  {
                    isActionLoading[0] ? <Loading size='small' />
                      :
                      <img src={activeButton === 'thumbsDown' ? thumbsdowna : thumbsdown} alt='thumbs down' />
                  }
                </button>
              </div>
              <div className='absolute reactionButton w-[73px] h-[71px] flex justify-center items-center' style={{ bottom: '0.5%', left: '30%' }}>
                <button onClick={handleButtonClickUp} className={activeButton === 'thumbsUp' ? 'active' : ''}>
                  {
                    isActionLoading[1] ? <Loading size='small' />
                      :
                      <img src={activeButton === 'thumbsUp' ? tumbsupa : tumbsup} alt='thumbs up' />
                  }
                </button>
              </div>
              <div className='absolute reactionButton w-[73px] h-[71px] flex justify-center items-center' style={{ bottom: '0.5%', left: '50%' }}>
                <button onClick={() => { visitWebClicked() }} >
                  {
                    isActionLoading[2] ? <Loading size='small' />
                      :
                      <img src={visitWebsite} alt='Visit Us' />
                  }
                </button>
              </div>
              <div className='absolute reactionButton w-[73px] h-[71px] flex justify-center items-center' style={{ bottom: '0.5%', left: '70%' }}>
                <button onClick={() => { callUsClicked() }} >
                  {
                    isActionLoading[3] ? <Loading size='small' />
                      :
                      <img src={callUs} alt='Call Us' />
                  }
                </button>
              </div>
              {/* </div> */}
            </div>
          </>
      }
    </div>
  )
}
export default AdBoard