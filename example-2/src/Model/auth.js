import axios from 'axios'

let baseURL = 'http://localhost:2000'

const init = async () => {
    return await axios.get(baseURL)
}

export default init