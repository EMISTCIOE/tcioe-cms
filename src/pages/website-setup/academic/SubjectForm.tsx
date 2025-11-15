import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useAcademicProgramOptions } from '@/hooks/useAcademicProgramOptions';
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation
} from './redux/academic.api';
import {
  ISubject,
  ISubjectCreatePayload,
  ISubjectUpdatePayload,
  PROGRAM_OPTIONS,
  SEMESTER_OPTIONS
} from './types';

interface SubjectFormProps {
  subject?: ISubject;
  onCancel: () => void;
  onSuccess: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onCancel, onSuccess }) => {
  const [name, setName] = useState(subject?.name ?? '');
  const [code, setCode] = useState(subject?.code ?? '');
  const [semester, setSemester] = useState(subject?.semester ?? SEMESTER_OPTIONS[0]);
  const [program, setProgram] = useState(subject?.program ?? PROGRAM_OPTIONS[0].value);
  const [topicsCovered, setTopicsCovered] = useState(subject?.topics_covered ?? '');
  const [academicProgramId, setAcademicProgramId] = useState<number | null>(subject?.academic_program?.id ?? null);

  const { options: academicProgramOptions } = useAcademicProgramOptions();
  const [createSubject, { isLoading: creating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: updating }] = useUpdateSubjectMutation();

  const isSubmitting = creating || updating;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) {
      toast.error('Please fill in the required fields.');
      return;
    }

    const payload: ISubjectCreatePayload = {
      name: name.trim(),
      code: code.trim(),
      semester,
      program,
      topics_covered: topicsCovered,
      academic_program_id: academicProgramId ?? undefined
    };

    try {
      if (subject) {
        const updatePayload: ISubjectUpdatePayload = {
          id: subject.id,
          ...payload
        };
        await updateSubject(updatePayload).unwrap();
        toast.success('Subject updated successfully');
      } else {
        await createSubject(payload).unwrap();
        toast.success('Subject created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save subject. Try again later.');
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {subject ? 'Edit Subject' : 'Add Subject'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage course subjects for the academic program.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Subject Name" value={name} onChange={(event) => setName(event.target.value)} fullWidth required />
              <TextField label="Code" value={code} onChange={(event) => setCode(event.target.value)} fullWidth required />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="subject-semester-label">Semester</InputLabel>
                <Select
                  labelId="subject-semester-label"
                  label="Semester"
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  required
                >
                  {SEMESTER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="subject-program-label">Program</InputLabel>
                <Select
                  labelId="subject-program-label"
                  label="Program"
                  value={program}
                  onChange={(event) => setProgram(event.target.value)}
                  required
                >
                  {PROGRAM_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <FormControl fullWidth>
              <InputLabel id="subject-academic-program-label">Academic Program (optional)</InputLabel>
              <Select
                labelId="subject-academic-program-label"
                label="Academic Program (optional)"
                value={academicProgramId ?? ''}
                onChange={(event) => setAcademicProgramId(event.target.value ? Number(event.target.value) : null)}
              >
                <MenuItem value="">Independent</MenuItem>
                {academicProgramOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <RichTextEditor label="Topics Covered" value={topicsCovered} onChange={setTopicsCovered} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Subject
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
