import axios from "axios"

export default async function make_request(end_point: string, token: any = undefined, method = "GET", body: any = undefined) {
  const API_URL = process.env.REACT_APP_API_URL

  const config = {
    headers: {
      'x-auth-token': `${token}`
    }
  }

  switch (method) {

    case "GET":
      try {
        const result = await axios.get(`${API_URL}${end_point}`, config)
        return [null, result.data]
      } catch (error: any) {
        let message = ""
        if (error.response !== undefined && error.response.status === 500) {
          message = error.response.data.message
        } else {
          if (error.response !== undefined) {
            message = error.response.data
          } else {
            message = error.message
          }
        }
        // console.log(error.response)
        return [message, null]

      }
    case "POST":
      try {
        if (Object.keys(body).length > 0) {
          const result = await axios.post(`${API_URL}${end_point}`, body, config)
          return [null, result.data]
        }
        return ["body is required for a post request", null]
      } catch (error: any) {
        let message = ""
        if (error.response !== undefined && error.response.status === 500) {
          message = error.response.data.message
        } else {
          if (error.response !== undefined) {
            message = error.response.data
          } else {
            message = error.message
          }
        }
        console.log(error.response)
        return [message, null]
      }
    default:
      return ["Method not implemented yet", null]
  }
}