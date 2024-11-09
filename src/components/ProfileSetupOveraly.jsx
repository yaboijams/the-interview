// ProfileSetupOverlay.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function ProfileSetupOverlay({ step, setStep, onClose, targetRef }) {
  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
    else onClose();
  };

  const targetPosition = targetRef?.current?.getBoundingClientRect();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        color: 'white',
      }}
    >
      {/* Spotlight */}
      {step === 1 && targetPosition && (
        <Box
          sx={{
            position: 'absolute',
            top: targetPosition.top,
            left: targetPosition.left,
            width: targetPosition.width,
            height: targetPosition.height,
            border: '4px solid yellow',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Step Instructions */}
      <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', p: 3 }}>
        {step === 1 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Step 1: Upload Your Profile Picture
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Click on your profile picture to upload a new image.
            </Typography>
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Step 2: Add Your Current Position
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Let others know where you work and your current role.
            </Typography>
          </Box>
        )}
        {step === 3 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Step 3: Complete Your Bio and Other Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Write a brief bio to share more about yourself.
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleNextStep}
          sx={{ mt: 3, bgcolor: 'primary.main', color: 'white', px: 4 }}
        >
          {step < 3 ? 'Next' : 'Finish'}
        </Button>
      </Box>
    </Box>
  );
}

export default ProfileSetupOverlay;
