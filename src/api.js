import axios from 'axios'
const instance = axios.create({
    baseURL: 'localhost:8000',
    headers: {
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
    }
})

instance.prototype.getUsers = async () => {
    try {
        return await instance.get('user')
    } catch (err) {
        return err
    }
}
export default instance