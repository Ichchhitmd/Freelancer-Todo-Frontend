import { UserProfilePictureResponse } from 'types/userTypes';
import { patch } from './api';
import { store } from 'redux/store';

export const updateUserProfilePicture = async (
  userdata: FormData
): Promise<UserProfilePictureResponse> => {
  const token = store.getState().auth.token;

  if (!token) {
    throw new Error('No authentication token available');
  }

  return patch<UserProfilePictureResponse>('/users/photo', userdata, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
