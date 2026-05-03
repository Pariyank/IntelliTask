const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');


exports.getManagerAnalytics = async (req, res) => {
  try {
    const myProjects = await Project.find({ owner: req.user._id });
    const projectIds = myProjects.map(p => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });

    const statusDistribution = [
      { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
      { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
    ];

    const members = await User.find({ role: 'Member' });
    const workload = members.map(m => ({
      name: m.displayName.split(' ')[0],
      tasks: tasks.filter(t => t.assignedTo?.toString() === m._id.toString()).length
    })).filter(w => w.tasks > 0);

    res.json({ statusDistribution, workload, totalTasks: tasks.length });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed" });
  }
};


exports.getMemberProductivity = async (req, res) => {
  try {
    const myTasks = await Task.find({ assignedTo: req.user._id });
   
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = myTasks.filter(t => 
        t.status === 'Done' && 
        new Date(t.updatedAt).toDateString() === d.toDateString()
      ).length;
      return { day: dayName, count };
    }).reverse();

    res.json({
      heatmap: last7Days,
      stats: {
        completed: myTasks.filter(t => t.status === 'Done').length,
        pending: myTasks.filter(t => t.status !== 'Done').length,
        efficiency: myTasks.length > 0 ? Math.round((myTasks.filter(t => t.status === 'Done').length / myTasks.length) * 100) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Productivity fetch failed" });
  }
};

exports.getTeamPerformance = async (req, res) => {
  try {
    const completedProjects = await Project.find({ owner: req.user._id, status: 'Completed' }).populate('members', 'displayName photoURL');
    const performanceMap = {};
    completedProjects.forEach(proj => {
      proj.members.forEach(member => {
        if (!performanceMap[member._id]) {
          performanceMap[member._id] = { id: member._id, name: member.displayName, photo: member.photoURL, onTime: 0, score: 0 };
        }
        performanceMap[member._id].onTime += 1;
        performanceMap[member._id].score += 50;
      });
    });
    res.json(Object.values(performanceMap).sort((a, b) => b.score - a.score));
  } catch (err) {
    res.status(500).json({ message: "Leaderboard error" });
  }
};