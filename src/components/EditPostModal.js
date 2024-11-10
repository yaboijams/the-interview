import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider } from '@mui/material';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categories = ['General', 'Tech', 'Finance', 'Healthcare', 'Business', 'Government', 'Education', 'Creative', 'Freelance', 'Other'];

function EditPostModal({ open, onClose, postId, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [applicationProcess, setApplicationProcess] = useState('');
  const [skills, setSkills] = useState('');
  const [interviewFormat, setInterviewFormat] = useState('');
  const [challenges, setChallenges] = useState('');
  const [salaryInsights, setSalaryInsights] = useState('');
  const [reflections, setReflections] = useState('');
  const [futureGoals, setFutureGoals] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (postId) {
        setLoading(true);
        try {
          const postRef = doc(db, 'posts', postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = postSnap.data();
            setTitle(postData.title || '');
            setDescription(postData.description || '');
            setCategory(postData.category || '');
            setCompany(postData.company || '');
            setPosition(postData.position || '');
            setApplicationProcess(postData.applicationProcess || '');
            setSkills(postData.skills || '');
            setInterviewFormat(postData.interviewFormat || '');
            setChallenges(postData.challenges || '');
            setSalaryInsights(postData.salaryInsights || '');
            setReflections(postData.reflections || '');
            setFutureGoals(postData.futureGoals || '');
            setAdvice(postData.advice || '');
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (open) fetchPostDetails();
  }, [postId, open]);

  const handleSave = async () => {
    if (!postId) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        title,
        description,
        category,
        company,
        position,
        applicationProcess,
        skills,
        interviewFormat,
        challenges,
        salaryInsights,
        reflections,
        futureGoals,
        advice,
        editedAt: new Date(), // Adds a timestamp for the edit
      });
      onSave(postId, { title, description, category, company, position, applicationProcess, skills, interviewFormat, challenges, salaryInsights, reflections, futureGoals, advice });
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link'],
    ],
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-post-title">
      <Box sx={modalStyles}>
        <Typography id="edit-post-title" variant="h6" gutterBottom>
          Edit Post
        </Typography>

        <Box sx={{ overflowY: 'auto', maxHeight: { xs: '60vh', sm: '75vh' }, pr: 2 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {/* Title and Description */}
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Category */}
              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </TextField>

              {/* Company and Position */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Job Position</Typography>
              <TextField
                label="Company or Organization"
                fullWidth
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Role/Position"
                fullWidth
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Application Process */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Application Process</Typography>
              <ReactQuill
                value={applicationProcess}
                onChange={setApplicationProcess}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />

              {/* Skills */}
              <TextField
                label="Skills and Qualifications"
                fullWidth
                multiline
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Interview Format */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Interview Process</Typography>
              <ReactQuill
                value={interviewFormat}
                onChange={setInterviewFormat}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />

              {/* Challenges */}
              <ReactQuill
                value={challenges}
                onChange={setChallenges}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />

              {/* Salary Insights */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Salary/Benefits Insights</Typography>
              <ReactQuill
                value={salaryInsights}
                onChange={setSalaryInsights}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />

              {/* Reflections and Future Goals */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Reflections and Future Goals</Typography>
              <ReactQuill
                value={reflections}
                onChange={setReflections}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />
              <ReactQuill
                value={futureGoals}
                onChange={setFutureGoals}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default', marginBottom: '16px' }}
              />

              {/* Advice */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Advice for Others</Typography>
              <ReactQuill
                value={advice}
                onChange={setAdvice}
                theme="snow"
                modules={quillModules}
                style={{ backgroundColor: 'background.default' }}
              />
            </>
          )}
        </Box>

        {/* Save Button */}
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Modal>
  );
}

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 1,
  overflowY: 'auto',
};

export default EditPostModal;
