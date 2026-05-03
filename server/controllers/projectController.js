const Project = require('../models/Project');


exports.getManagerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).populate('members', 'displayName photoURL');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAllocations = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id }).populate('owner', 'displayName');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ 
      ...req.body, 
      owner: req.user._id,
      members: [req.user._id] 
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProjectMeta = async (req, res) => {
  try {
    const { status, notes, deadline } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (status) {
      project.status = status;
      if (status === 'Completed') project.actualCompletionDate = new Date();
    }
    if (notes) project.submissionNotes = notes;
    if (deadline) project.deadline = deadline;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.submitProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { status: 'Under Review', submissionNotes: req.body.notes },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};