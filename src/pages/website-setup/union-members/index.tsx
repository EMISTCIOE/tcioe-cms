import { ChangeEvent, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemAvatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { authState } from '@/pages/authentication/redux/selector';
import {
  useDeletCampusUnionsMemberMutation,
  usePatchCampusUnionsMutation,
  useRetrieveCampusUnionsQuery
} from '@/pages/website-setup/campus-unions/redux/campusUnions.api';

type UnionDetailsFormValues = {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  websiteUrl: string;
};

const UnionMembersPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { unionId, unionName } = useAppSelector(authState);
  const { data: unionDetail, refetch } = useRetrieveCampusUnionsQuery(unionId ?? '', {
    skip: !unionId
  });
  const [patchUnion, { isLoading: isPatching }] = usePatchCampusUnionsMutation();
  const [deleteMember] = useDeletCampusUnionsMemberMutation();

  const {
    control: memberControl,
    handleSubmit: handleMemberSubmit,
    reset: resetMemberForm,
    formState: { errors: memberErrors }
  } = useForm<{ fullName: string; designation: string }>({
    defaultValues: {
      fullName: '',
      designation: ''
    }
  });

  const {
    control: unionControl,
    handleSubmit: handleUnionSubmit,
    reset: resetUnionForm
  } = useForm<UnionDetailsFormValues>({
    defaultValues: {
      name: '',
      shortDescription: '',
      detailedDescription: '',
      websiteUrl: ''
    }
  });

  const {
    control: editMemberControl,
    handleSubmit: handleEditMemberSubmit,
    reset: resetEditMemberForm,
    formState: { errors: editMemberErrors }
  } = useForm<{ fullName: string; designation: string }>({
    defaultValues: {
      fullName: '',
      designation: ''
    }
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Member photo states
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null);
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string | null>(null);

  // Edit member states
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (unionDetail) {
      resetUnionForm({
        name: unionDetail.name ?? '',
        shortDescription: unionDetail.shortDescription ?? '',
        detailedDescription: unionDetail.detailedDescription ?? '',
        websiteUrl: unionDetail.websiteUrl ?? ''
      });
      setThumbnailFile(null);
      setThumbnailPreview(unionDetail.thumbnail ?? null);
    }
  }, [unionDetail, resetUnionForm]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      if (memberPhotoPreview && memberPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(memberPhotoPreview);
      }
    };
  }, [thumbnailPreview, memberPhotoPreview]);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  const handleMemberPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMemberPhoto(file);
      const objectUrl = URL.createObjectURL(file);
      setMemberPhotoPreview(objectUrl);
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    resetEditMemberForm({
      fullName: member.fullName || '',
      designation: member.designation || ''
    });
    setMemberPhoto(null);
    setMemberPhotoPreview(member.photo || null);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingMember(null);
    setMemberPhoto(null);
    if (memberPhotoPreview && memberPhotoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(memberPhotoPreview);
    }
    setMemberPhotoPreview(null);
    resetEditMemberForm();
  };

  const onUnionDetailsSubmit = async (values: UnionDetailsFormValues) => {
    if (!unionId) return;
    try {
      const payload = {
        name: values.name.trim(),
        shortDescription: values.shortDescription.trim(),
        detailedDescription: values.detailedDescription?.trim() || undefined,
        websiteUrl: values.websiteUrl?.trim() || undefined,
        isActive: unionDetail?.isActive ?? true,
        thumbnail: thumbnailFile ?? undefined
      };

      const response = await patchUnion({ id: unionId, values: payload }).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setThumbnailFile(null);
      if (!thumbnailFile && unionDetail?.thumbnail) {
        setThumbnailPreview(unionDetail.thumbnail);
      }
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to update union details', { variant: 'error' });
    }
  };

  const onAddMember = async (values: { fullName: string; designation: string }) => {
    if (!unionId || !unionDetail) return;
    try {
      const memberData: any = {
        fullName: values.fullName,
        designation: values.designation
      };

      if (memberPhoto) {
        memberData.photo = memberPhoto;
      }

      const existingMembers = unionDetail.members || [];

      const response = await patchUnion({
        id: unionId,
        values: {
          name: unionDetail.name,
          shortDescription: unionDetail.shortDescription,
          detailedDescription: unionDetail.detailedDescription,
          websiteUrl: unionDetail.websiteUrl,
          isActive: unionDetail.isActive,
          members: [...existingMembers, memberData]
        }
      }).unwrap();

      dispatch(setMessage({ message: response.message, variant: 'success' }));
      resetMemberForm();
      setMemberPhoto(null);
      if (memberPhotoPreview && memberPhotoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(memberPhotoPreview);
      }
      setMemberPhotoPreview(null);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to add member', { variant: 'error' });
    }
  };

  const onEditMember = async (values: { fullName: string; designation: string }) => {
    if (!unionId || !editingMember || !unionDetail) return;
    try {
      const updatedMemberData: any = {
        id: editingMember.id,
        fullName: values.fullName,
        designation: values.designation,
        isActive: editingMember.isActive
      };

      if (memberPhoto) {
        updatedMemberData.photo = memberPhoto;
      } else {
        updatedMemberData.photo = editingMember.photo;
      }

      const updatedMembers = unionDetail.members.map((member) => (member.id === editingMember.id ? updatedMemberData : member));

      const response = await patchUnion({
        id: unionId,
        values: {
          name: unionDetail.name,
          shortDescription: unionDetail.shortDescription,
          detailedDescription: unionDetail.detailedDescription,
          websiteUrl: unionDetail.websiteUrl,
          isActive: unionDetail.isActive,
          members: updatedMembers
        }
      }).unwrap();

      dispatch(setMessage({ message: response.message || 'Member updated successfully', variant: 'success' }));
      handleCloseEditDialog();
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to update member', { variant: 'error' });
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
      <Typography variant="h4">Manage {unionName ?? 'Union'}</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Union Details</Typography>
        <form onSubmit={handleUnionSubmit(onUnionDetailsSubmit)} noValidate>
          <Stack spacing={2} mt={2}>
            <Controller
              name="name"
              control={unionControl}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Union Name"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="shortDescription"
              control={unionControl}
              rules={{ required: 'Short description is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Short Description"
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="detailedDescription"
              control={unionControl}
              render={({ field, fieldState }) => (
                <TextField
                  label="Detailed Description"
                  fullWidth
                  multiline
                  minRows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="websiteUrl"
              control={unionControl}
              rules={{
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- \.\/?%&=]*)?$/i,
                  message: 'Enter a valid URL'
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Website URL"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || 'Optional'}
                  {...field}
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Union Thumbnail
                </Typography>
                <Button variant="outlined" component="label" disabled={isPatching}>
                  Upload Image
                  <input hidden type="file" accept="image/*" onChange={handleThumbnailChange} />
                </Button>
              </Box>
              {thumbnailPreview && (
                <Box
                  component="img"
                  src={thumbnailPreview}
                  alt="Union thumbnail preview"
                  sx={{ width: 96, height: 96, borderRadius: 2, objectFit: 'cover' }}
                />
              )}
            </Stack>

            <FormControlLabel control={<Switch checked={unionDetail?.isActive ?? false} disabled />} label="Union is active" />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" type="submit" disabled={isPatching}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

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
                      <Box>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditMember(member)} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(member.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={member.photo || undefined} alt={member.fullName} sx={{ width: 56, height: 56 }}>
                        {!member.photo && member.fullName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={member.fullName} secondary={member.designation} />
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
            <form onSubmit={handleMemberSubmit(onAddMember)} noValidate>
              <Stack spacing={2} mt={2}>
                <Controller
                  name="fullName"
                  control={memberControl}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      label="Full Name"
                      fullWidth
                      error={!!memberErrors.fullName}
                      helperText={memberErrors.fullName?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="designation"
                  control={memberControl}
                  rules={{ required: 'Designation is required' }}
                  render={({ field }) => (
                    <TextField
                      label="Designation"
                      fullWidth
                      error={!!memberErrors.designation}
                      helperText={memberErrors.designation?.message}
                      {...field}
                    />
                  )}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Member Photo
                    </Typography>
                    <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} disabled={isPatching}>
                      Upload Photo
                      <input hidden type="file" accept="image/*" onChange={handleMemberPhotoChange} />
                    </Button>
                  </Box>
                  {memberPhotoPreview && <Avatar src={memberPhotoPreview} alt="Member photo preview" sx={{ width: 64, height: 64 }} />}
                </Stack>

                <Button variant="contained" type="submit" disabled={isPatching}>
                  Add Member
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditMemberSubmit(onEditMember)} noValidate>
            <Stack spacing={2} mt={2}>
              <Controller
                name="fullName"
                control={editMemberControl}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    label="Full Name"
                    fullWidth
                    error={!!editMemberErrors.fullName}
                    helperText={editMemberErrors.fullName?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="designation"
                control={editMemberControl}
                rules={{ required: 'Designation is required' }}
                render={({ field }) => (
                  <TextField
                    label="Designation"
                    fullWidth
                    error={!!editMemberErrors.designation}
                    helperText={editMemberErrors.designation?.message}
                    {...field}
                  />
                )}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Member Photo
                  </Typography>
                  <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} disabled={isPatching}>
                    {memberPhotoPreview ? 'Change Photo' : 'Upload Photo'}
                    <input hidden type="file" accept="image/*" onChange={handleMemberPhotoChange} />
                  </Button>
                </Box>
                {memberPhotoPreview && <Avatar src={memberPhotoPreview} alt="Member photo preview" sx={{ width: 64, height: 64 }} />}
              </Stack>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditMemberSubmit(onEditMember)} variant="contained" disabled={isPatching}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default UnionMembersPage;
