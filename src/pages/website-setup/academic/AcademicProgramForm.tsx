import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { FileUpload } from '@/components/FileUpload';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useCreateAcademicProgramMutation, useUpdateAcademicProgramMutation } from './redux/academic.api';
import { IAcademicProgram, IAcademicProgramCreatePayload, IAcademicProgramUpdatePayload, ACADEMIC_PROGRAM_TYPE_OPTIONS } from './types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface AcademicProgramFormProps {
  program?: IAcademicProgram;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AcademicProgramForm: React.FC<AcademicProgramFormProps> = ({ program, onCancel, onSuccess }) => {
  const [name, setName] = useState(program?.name ?? '');
  const [shortName, setShortName] = useState(program?.short_name ?? '');
  const [description, setDescription] = useState(program?.description ?? '');
  const [programType, setProgramType] = useState(program?.program_type ?? ACADEMIC_PROGRAM_TYPE_OPTIONS[0].value);
  const [departmentId, setDepartmentId] = useState<number | ''>(program?.department?.id ?? '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isActive, setIsActive] = useState<Boolean>(program?.is_active ?? true);

  const { options } = useDepartmentOptions();
  const { roleType, departmentId: userDepartmentId } = useAppSelector(authState);

  useEffect(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(userDepartmentId);
    const lockedOption = options.find((opt) => String(opt.value) === String(userDepartmentId));

    if (isDepartmentAdmin && lockedOption) {
      setDepartmentId(Number(userDepartmentId));
    } else if (!departmentId && options.length > 0) {
      setDepartmentId(options[0].value);
    }
  }, [departmentId, options, roleType, userDepartmentId]);

  const [createAcademicProgram, { isLoading: creating }] = useCreateAcademicProgramMutation();
  const [updateAcademicProgram, { isLoading: updating }] = useUpdateAcademicProgramMutation();

  const isSubmitting = creating || updating;

  const handleThumbnailChange = (file: File | File[] | null) => {
    if (Array.isArray(file)) {
      setThumbnail(file[0] ?? null);
    } else {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (departmentId === '') {
      toast.error('Please select a department.');
      return;
    }

    if (!name.trim()) {
      toast.error('Program name is required.');
      return;
    }

    if (!programType) {
      toast.error('Program type is required.');
      return;
    }

    const payload: IAcademicProgramCreatePayload = {
      name: name.trim(),
      program_type: programType,
      department: Number(departmentId)
    };

    // Add optional fields only if they have values
    if (shortName.trim()) {
      payload.short_name = shortName.trim();
    }

    if (description.trim()) {
      payload.description = description.trim();
    }

    if (thumbnail) {
      payload.thumbnail = thumbnail;
    }

    try {
      if (program) {
        const updatePayload: IAcademicProgramUpdatePayload = {
          id: program.id,
          ...payload,
          is_active: isActive
        };
        await updateAcademicProgram(updatePayload).unwrap();
        toast.success('Program updated successfully');
      } else {
        console.log('Payload being sent:', payload);
        await createAcademicProgram(payload).unwrap();
        toast.success('Program created successfully');
      }
      onSuccess();
    } catch (error: any) {
      console.error('API Error:', error);

      // Extract detailed error message
      let errorMessage = 'Failed to save program. Please try again.';

      if (error?.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else {
          // Handle field-specific errors
          const fieldErrors = [];
          for (const [field, messages] of Object.entries(error.data)) {
            if (Array.isArray(messages)) {
              fieldErrors.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              fieldErrors.push(`${field}: ${messages}`);
            }
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {program ? 'Edit Academic Program' : 'Create Academic Program'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {program ? 'Update the department program details.' : 'Capture the academic program details for the department.'}
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Program Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth required />
              <TextField label="Short Name" value={shortName} onChange={(event) => setShortName(event.target.value)} fullWidth />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="academic-program-type-label">Program Type</InputLabel>
                <Select
                  labelId="academic-program-type-label"
                  label="Program Type"
                  value={programType}
                  onChange={(event: SelectChangeEvent<string>) => setProgramType(event.target.value)}
                  required
                >
                  {ACADEMIC_PROGRAM_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={roleType === 'DEPARTMENT-ADMIN' && Boolean(userDepartmentId)}>
                <InputLabel id="academic-program-department-label">Department</InputLabel>
                <Select
                  labelId="academic-program-department-label"
                  label="Department"
                  value={departmentId}
                  onChange={(event) => setDepartmentId(Number(event.target.value))}
                  required
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              rows={4}
              required
            />

            <FileUpload label="Program Thumbnail" onChange={handleThumbnailChange} value={thumbnail} accept="image/*" maxSize={5} />

            {program?.thumbnail && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Current thumbnail
                </Typography>
                <Box
                  component="img"
                  src={program.thumbnail}
                  alt="Program thumbnail"
                  sx={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 1, mt: 1 }}
                />
              </Box>
            )}

            <FormControlLabel
              control={<Switch checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />}
              label="Active"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Program
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
