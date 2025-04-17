import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const live_scores_cricket=async ()=>{
    try {
        const response = await axios.post(`${API_BASE_URL}/live_scores/cricket`);
        return response.data; 
    } catch (error) {
        throw error|| "Failed to fetch live scores";
    }
}

export default live_scores_cricket;