import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Divider, Tooltip, Select, MenuItem, FormControl, InputLabel, Autocomplete } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import SubmitButton from './SubmitButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categories = ['General', 'Tech', 'Finance', 'Healthcare', 'Business', 'Government', 'Education', 'Creative', 'Freelance', 'Other'];

function PostForm({ onSubmit }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [applicationProcess, setApplicationProcess] = useState('');
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]); // Store fetched skills here
  const [interviewFormat, setInterviewFormat] = useState('');
  const [challenges, setChallenges] = useState('');
  const [salaryInsights, setSalaryInsights] = useState('');
  const [reflections, setReflections] = useState('');
  const [futureGoals, setFutureGoals] = useState('');
  const [advice, setAdvice] = useState('');

  // Fetch predefined skills from Firebase
  useEffect(() => {
    const fetchSkills = async () => {
      const skillsCollection = collection(db, 'skills');
      const skillsSnapshot = await getDocs(skillsCollection);
      const skillsList = skillsSnapshot.docs.map(doc => doc.data().name);
      setAllSkills(skillsList);
    };
    fetchSkills();
  }, []);

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

  const handleSkillChange = async (event, newValue) => {
    setSkills(newValue);
    const newSkills = newValue.filter(skill => !allSkills.includes(skill));
    
    // Save any new skills to Firebase
    for (const skill of newSkills) {
      const skillRef = collection(db, 'skills');
      await addDoc(skillRef, { name: skill });
      setAllSkills(prevSkills => [...prevSkills, skill]);
    }
  };

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
    setSkills([]);
    setInterviewFormat('');
    setChallenges('');
    setSalaryInsights('');
    setReflections('');
    setFutureGoals('');
    setAdvice('');
  };

  const quillModules = {
    toolbar: [
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link']
    ],
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
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Job Position</Typography>
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

      {/* Application Process with Rich Text Editor */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Application Process</Typography>
      <ReactQuill
        value={applicationProcess}
        onChange={setApplicationProcess}
        placeholder="Describe how you found and applied for this job..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      {/* Skills with Autocomplete from Firebase */}
      <Autocomplete
        multiple
        freeSolo
        options={allSkills}
        value={skills}
        onChange={handleSkillChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills and Qualifications"
            variant="outlined"
            placeholder="Add skills or qualifications"
            sx={{ backgroundColor: 'background.default' }}
          />
        )}
      />

      {/* Interview Process */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Interview Process</Typography>
      <ReactQuill
        value={interviewFormat}
        onChange={setInterviewFormat}
        placeholder="Describe the interview format..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      {/* Challenges */}
      <ReactQuill
        value={challenges}
        onChange={setChallenges}
        placeholder="Describe any challenges or obstacles you faced..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      {/* Salary Insights (Optional) */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Salary/Benefits Insights (Optional)</Typography>
      <ReactQuill
        value={salaryInsights}
        onChange={setSalaryInsights}
        placeholder="Share insights on salary negotiation or benefits..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      {/* Reflections and Future Goals */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Reflections and Future Goals</Typography>
      <ReactQuill
        value={reflections}
        onChange={setReflections}
        placeholder="Reflect on the experience and lessons learned..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />
      <ReactQuill
        value={futureGoals}
        onChange={setFutureGoals}
        placeholder="Share your future goals or aspirations..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      {/* Advice */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Advice for Others</Typography>
      <ReactQuill
        value={advice}
        onChange={setAdvice}
        placeholder="Provide advice for others based on your experience..."
        theme="snow"
        modules={quillModules}
        style={{ backgroundColor: 'background.default' }}
      />

      <SubmitButton disabled={!title || !description || !category || !company || !position || !advice} />
    </Box>
  );
}

export default PostForm;
