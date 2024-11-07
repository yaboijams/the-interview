// src/components/PostForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Divider, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import SubmitButton from './SubmitButton';

const categories = ['General', 'Tech', 'Finance', 'Healthcare', 'Business', 'Education', 'Creative', 'Freelance', 'Other'];

function PostForm({ onSubmit }) {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCompany(userData.currentCompany || '');
          setPosition(userData.currentPosition || '');
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
    });
    // Reset fields
    setTitle('');
    setDescription('');
    setCategory('');
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
      {/* Category Selection */}
      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Category"
          sx={{ backgroundColor: 'background.default' }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Title and Description */}
      <Tooltip title="Enter a short, catchy title for your post" arrow>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., 'Breaking into the Tech Industry: My Journey'"
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
          placeholder="Summarize your career journey in a sentence or two."
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      {/* Company and Position */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Current Position</Typography>
      <TextField
        label="Company or Organization"
        variant="outlined"
        fullWidth
        required
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="E.g., 'I am currently working at [Company Name] as a [Position]...'"
        sx={{ backgroundColor: 'background.default' }}
      />
      <TextField
        label="Role/Position"
        variant="outlined"
        fullWidth
        required
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="E.g., 'My role involves...'"
        sx={{ backgroundColor: 'background.default' }}
      />

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
          placeholder="E.g., 'I found the job through a [source] and decided to apply because...'"
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
          placeholder="E.g., 'Some skills that helped me stand out were...'"
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
          placeholder="E.g., 'The interview consisted of [steps] and included questions on...'"
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
          placeholder="E.g., 'One of the challenges I faced was...'"
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
          placeholder="E.g., 'During the negotiation process, I found it helpful to...'"
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
          placeholder="E.g., 'Looking back, I learned that...'"
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
          placeholder="E.g., 'In the future, I aim to...'"
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
          placeholder="E.g., 'My advice for anyone looking to enter this field is...'"
          sx={{ backgroundColor: 'background.default' }}
        />
      </Tooltip>

      <SubmitButton disabled={!title || !description || !category || !company || !position || !advice} />
    </Box>
  );
}

export default PostForm;
