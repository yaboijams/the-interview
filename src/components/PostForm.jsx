// src/components/PostForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Divider, Tooltip } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import SubmitButton from './SubmitButton';

function PostForm({ onSubmit }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          setCompany(userData.currentCompany || '');
          setPosition(userData.currentPosition || '');
          
          console.log('Autofilled Fields:', {
            company: userData.currentCompany || '',
            position: userData.currentPosition || '',
          });
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
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
    });
    setTitle('');
    setDescription('');
    setCompany('');
    setPosition('');
    setApplicationProcess('');
    setSkills('');
    setInterviewFormat('');
    setChallenges('');
    setSalaryInsights('');
    setReflections('');
    setFutureGoals('');
    setAdvice('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Tooltip title="Enter a short, catchy title for your post" arrow>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>
      <Tooltip title="Provide a brief overview of your journey" arrow>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Company and Position */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Current Position</Typography>
      <Tooltip title="Enter the name of the company you’re currently working at" arrow>
        <TextField
          label="Company or Organization"
          variant="outlined"
          fullWidth
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>
      <Tooltip title="Enter your job title or position" arrow>
        <TextField
          label="Role/Position"
          variant="outlined"
          fullWidth
          required
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Application Process */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Application Process</Typography>
      <Tooltip title="Describe how you found and applied for this job" arrow>
        <TextField
          label="How did you apply for this job?"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={applicationProcess}
          onChange={(e) => setApplicationProcess(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>
      <Tooltip title="List key skills or qualifications that helped you secure the job" arrow>
        <TextField
          label="Skills and Qualifications"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Interview Details */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Interview Process</Typography>
      <Tooltip title="Describe the format of the interview process" arrow>
        <TextField
          label="Interview Format"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={interviewFormat}
          onChange={(e) => setInterviewFormat(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>
      <Tooltip title="Describe any challenges or obstacles you faced" arrow>
        <TextField
          label="Challenges and Obstacles"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Salary Insights (Optional) */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Salary/Benefits Insights (Optional)</Typography>
      <Tooltip title="Share insights or advice on salary negotiation or benefits" arrow>
        <TextField
          label="Salary/Benefits Insights"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={salaryInsights}
          onChange={(e) => setSalaryInsights(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Reflections and Future Goals */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Reflections and Future Goals</Typography>
      <Tooltip title="Reflect on the experience and key lessons learned" arrow>
        <TextField
          label="Reflections and Key Learnings"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={reflections}
          onChange={(e) => setReflections(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>
      <Tooltip title="Share your future goals or aspirations in this role" arrow>
        <TextField
          label="Future Goals"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={futureGoals}
          onChange={(e) => setFutureGoals(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Advice */}
      <Divider sx={{ my: 3 }} />
      <Tooltip title="Provide advice or tips for others based on your experience" arrow>
        <TextField
          label="Advice for Others"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      <SubmitButton disabled={!title || !description || !company || !position || !advice} />
    </Box>
  );
}

export default PostForm;
