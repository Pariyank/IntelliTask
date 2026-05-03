router.post('/ai-suggest', protect, async (req, res) => {
  const { taskTitle } = req.body;
  
 
  const mockSuggestions = [
    `Initialize ${taskTitle} architecture`,
    `Write unit tests for ${taskTitle}`,
    `Review documentation for ${taskTitle}`
  ];

  res.json({ suggestions: mockSuggestions });
});