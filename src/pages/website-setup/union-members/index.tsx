import { useSnackbar } from 'notistack';
import { Button, Grid, List, ListItem, ListItemText, Paper, Stack, Typography, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { authState } from '@/pages/authentication/redux/selector';
import {
  useDeletCampusUnionsMemberMutation,
  usePatchCampusUnionsMutation,
  useRetrieveCampusUnionsQuery
} from '@/pages/website-setup/campus-unions/redux/campusUnions.api';

const UnionMembersPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { unionId, unionName } = useAppSelector(authState);
  const { data: unionDetail, refetch } = useRetrieveCampusUnionsQuery(unionId ?? '', {
    skip: !unionId
  });
  const [patchUnion, { isLoading: isPatching }] = usePatchCampusUnionsMutation();
  const [deleteMember] = useDeletCampusUnionsMemberMutation();

  const { control, handleSubmit, reset } = useForm<{ fullName: string; designation: string }>({
    defaultValues: {
      fullName: '',
      designation: ''
    }
  });

  const onSubmit = async (values: { fullName: string; designation: string }) => {
    if (!unionId) return;
    try {
      const response = await patchUnion({
        id: unionId,
        values: {
          members: [
            {
              fullName: values.fullName,
              designation: values.designation
            }
          ]
        }
      }).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      reset();
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to add member', { variant: 'error' });
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!unionId) return;
    try {
      await deleteMember({ id: unionId, member_id: memberId }).unwrap();
      enqueueSnackbar('Member removed', { variant: 'success' });
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to remove member', { variant: 'error' });
    }
  };

  if (!unionId) {
    return <Typography variant="body1">No union assigned to your account.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Manage {unionName ?? 'Union'} Members</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Members</Typography>
            <List>
              {unionDetail?.members?.length ? (
                unionDetail.members.map((member) => (
                  <ListItem
                    key={member.id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(member.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={member.full_name} secondary={member.designation} />
                  </ListItem>
                ))
              ) : (
                <Typography>No members added yet.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Add Member</Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2} mt={2}>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField label="Full Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
                  )}
                />
                <Controller
                  name="designation"
                  control={control}
                  rules={{ required: 'Designation is required' }}
                  render={({ field, fieldState }) => (
                    <TextField label="Designation" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
                  )}
                />
                <Button variant="contained" type="submit" disabled={isPatching}>
                  Add Member
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UnionMembersPage;
