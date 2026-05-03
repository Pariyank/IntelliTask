const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const AuditLog = require('../models/AuditLog');

exports.updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
  await AuditLog.create({ action: `Role changed for ${user.displayName} to ${newRole}`, user: req.user._id });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
};

exports.createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id, members: [req.user._id] });
  await AuditLog.create({ action: `Created Project: ${project.name}`, user: req.user._id });
  res.json(project);
};

exports.createTask = async (req, res) => {
  const task = await Task.create({ ...req.body });
  await AuditLog.create({ action: `Created Task: ${task.title}`, user: req.user._id });
  res.json(task);
};

exports.updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(task);
};