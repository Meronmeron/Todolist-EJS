import React, { useState, useEffect } from 'react';
import aiqemLogo from '../icon/aiqemLogo.svg';
import AdBoard from './AdBoard';
import Loading from '../util/Loading';
import { message } from 'antd';
import make_request from '../util/util';

const Header = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const [isSuccess, setIsSuccess] = useState(true)
  const [errorMessage, setErrorMessage] = useState("🚫 Error occurred, please comeback later! 🕒")

  const [urlData, setUrlData] = useState<any>({
    "channel_id": "",
    "bot_token": "",
    "token": ""
  })
  const [hasQueryParams, setHasQueryParams] = useState(false)

  const [pastedID, setPastedID] = useState("")



  useEffect(() => {
    setup()
  }, [])

  const setup = async () => {
    setIsLoading(true)
    let params = new URLSearchParams(window.location.search)
    if (params.size > 0) {
      let tempURLData = {
        "channel_id": params.get('channel_id'),
        "bot_token": params.get('bot_token'),
        "token": params.get('token')
      }
      setUrlData({ ...tempURLData })
      setHasQueryParams(true)
    }
    else {
      setHasQueryParams(false)
    }
    setIsLoading(false)
  }

  const submitButtonClicked = async () => {
    if (pastedID.length > 0) {
      setIsSubmitLoading(true)
      let loginData: any = {
        "username": process.env.REACT_APP_WEBAPP_USERNAME,
        "password": process.env.REACT_APP_WEBAPP_PASSWORD
      }
      const loginResponse = await make_request('auth/login', undefined, "POST", loginData)
      if (loginResponse[0] === null) {
        let token = loginResponse[1].token
        const response = await make_request(`admin/user_data/${pastedID}`, token, "GET", undefined)
        if (response[0] === null) {
          let data = response[1].data
          console.log(data)
          let tempRequestData = {
            "channel_id": data['channel_id'],
            "bot_token": data['bot_token'],
            "token": data['token']
          }
          setUrlData({ ...tempRequestData })
          setHasQueryParams(true)
          // setIsSuccess(true)
        }
        else {
          message.error(response[0])
        }
      } else {
        message.error(loginResponse[0])
        // setIsSuccess(false)
      }
      setIsSubmitLoading(false)
    } else {
      message.error("Please copy and paste the message from the bot.")
    }
  }

  const onPastedIDChange = (e: any) => {
    setPastedID(e.target.value)
  }

  return (
    <div className="h-fit">
      {/* <div className='flex flex-row'>
        <div className="mt-10 ml-7 ">
          <img src={xicon} alt='close icon' />
        </div>
        <div className='mt-10 ml-5'>
          <p className='text-[#000000] font-roboto font-semibold'>Ad Portal</p>
        </div>
        <div className='mt-11 ml-[206px]'>
          <img src={doteIcon} alt='option icon' />
        </div>
      </div> */}
      {/* <Divider className='border-[#C8C5C5]' /> */}


      {
        isLoading ?
          <div className="">
            <div className="absolute" style={{ left: '50%' }}>
              <img src={aiqemLogo} alt='aiqem logo' className='pt-1' />
            </div>
            <div className="absolute" style={{ top: '50%', left: '50%' }}>
              <Loading size='medium' />
            </div>
          </div>

          : isSuccess ?
            <div className="">
              <div className="mx-5 flex justify-center">
                <img src={aiqemLogo} alt='aiqem logo' className='pt-1' />
              </div>
              {
                hasQueryParams ?
                  <AdBoard data={urlData} setErrorMessage={setErrorMessage} setIsSuccess={setIsSuccess} />
                  :
                  <div className='pt-10 mx-[5rem] flex justify-center'>
                    <div className="">
                      <label className="block text-sm font-medium leading-6 text-gray-900">Paste the message here:</label>
                      <div className="mt-2">
                        <input onChange={onPastedIDChange} value={pastedID} type="number" placeholder="Paste here 📋" className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        <div className="flex justify-center">
                          {
                            isSubmitLoading ? <div className="pt-7">
                              <Loading size='small' />
                            </div> :
                              <button className='w-[85px] h-[37px] mt-2 border-2 border-[#FF5003] text-white bg-[#FF5003] rounded-lg text-sm font-roboto font-semibold' onClick={submitButtonClicked}>Submit</button>

                          }
                        </div>
                      </div>
                    </div>

                  </div>
              }
            </div>
            :
            <div className="">
              <div className="absolute" style={{ left: '40%' }}>
                <img src={aiqemLogo} alt='aiqem logo' className='pt-1' />
              </div>
              <div className="absolute" style={{ top: '50%', left: '10%' }}>
                <span>
                  {errorMessage}
                </span>
              </div>
            </div>
      }
      {/* <AdBoard/> */}
    </div>
  );
};

export default Header;

