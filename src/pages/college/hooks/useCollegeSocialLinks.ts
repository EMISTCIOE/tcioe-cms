import { useSnackbar } from 'notistack';
import { useDeleteSocialLinkMutation } from '../redux/college-info.api';

export const useCollegeSocialLinks = () => {
  const [deleteSocialLink] = useDeleteSocialLinkMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (uuid: string) => {
    try {
      await deleteSocialLink(uuid).unwrap();
      enqueueSnackbar('Social link deleted', { variant: 'success' });
      return true;
    } catch (error) {
      enqueueSnackbar('Delete failed', { variant: 'error' });
      return false;
    }
  };

  return { deleteSocialLink: handleDelete };
};