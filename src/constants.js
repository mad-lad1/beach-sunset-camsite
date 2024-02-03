import axios from 'axios';
export const extractSource = async () => {
    try {
        const apiUrl = `https://us-central1-beachcam-al.cloudfunctions.net/getSource`;
        const response = await axios.get(apiUrl);
        const sourceUrl = response.data.sourceUrl;
        return sourceUrl;
    } catch (error) {
        console.error("Error fetching or parsing webpage:", error);
    }
    return null;
};


