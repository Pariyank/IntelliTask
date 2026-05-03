router.get('/heatmap', protect, async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { assignedTo: req.user._id, status: 'Done' } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } },
    { $limit: 30 }
  ]);
  res.json(stats);
});