import axios from 'axios';

export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          return 'There was an issue with your request. Please check your input and try again.';
        case 401:
          return 'Unauthorized access. Please verify your credentials and try again.';
        case 404:
          return 'The requested resource could not be found. Please check the URL or try again later.';
        case 500:
          return 'Oops! Something went wrong on our end. Please try again later.';
        default:
          return `Unexpected error occurred: ${error.response?.data?.message || 'Please try again.'}`;
      }
    } else if (error.request) {
      return 'No response received from the server. Please check your internet connection and try again.';
    } else {
      return `An error occurred while processing your request: ${error.message}`;
    }
  } else {
    return 'Something went wrong. Please try again later.';
  }
};
