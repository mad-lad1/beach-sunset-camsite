import axios from 'axios';

/**
 * Constants representing the URLs for the sunset and sunrise live streams.
 * These streams provide live footage from designated beach cameras to enhance user experience.
 */
export const sunsetStream = "https://v.angelcam.com/iframe?v=1ny8jxnjr0&autoplay=1";
export const sunriseStream = "https://v.angelcam.com/iframe?v=jzy1v9dvyn&autoplay=1";

/**
 * Asynchronously extracts the source URL from a given webpage URL.
 * This function is designed to fetch the actual media stream URL by interfacing with a cloud function.
 * 
 * @param {string} url - The URL of the webpage to extract the media stream from.
 * @returns {Promise<string|null>} The source URL of the media stream if successful, or null if an error occurs.
 */
export const extractSource = async (url) => {
    try {
        // Encode the URL to ensure it's safe to pass as a query parameter.
        const encodedUrl = encodeURIComponent(url);
        // Construct the API URL with the encoded webpage URL.
        const apiUrl = `https://us-central1-beachcam-al.cloudfunctions.net/getSource?url=${encodedUrl}`;
        // Perform the GET request to the API.
        const response = await axios.get(apiUrl);
        // Extract the source URL from the response data.
        const sourceUrl = response.data.sourceUrl;
        return sourceUrl;
    } catch (error) {
        // Log the error to the console with a clear, descriptive message.
        console.error("An error occurred while fetching or parsing the webpage. Please check the URL and try again.", error);
        // Return null to indicate failure.
        return null;
    }
};


