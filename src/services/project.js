const { ROLE } = require('../constants');

const projectDao = require('../daos/project');
const userDao = require('../daos/user');
const cameraDao = require('../daos/camera');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const getProjects = async (condition, user) => {
  const ownerCondition = {};
  if (user?.role === ROLE.OWNER)
    ownerCondition.ownerId = { $in: user.projectIds };
  const result = await projectDao.getProjects(
    {
      ...condition,
      ...ownerCondition,
    },
    { lookupOwner: true },
  );

  return result;
};

const getProject = async (projectId, user) => {
  const ownerCondition = {};
  if (user?.role === ROLE.OWNER)
    ownerCondition.ownerId = { $in: user.projectIds };
  const project = await projectDao.getProject(
    {
      _id: projectId,
      ...ownerCondition,
    },
    { lookupOwner: true },
  );

  if (!project) throw new CustomError(errorCodes.PROJECT_NOT_FOUND);

  return project;
};

const createProject = async ({ ownerId, ...data }) => {
  const owner = await userDao.findUser(ownerId);
  if (!owner)
    throw new CustomError(errorCodes.USER_NOT_FOUND, 'Owner is not found');

  return await projectDao.createProject({...data, ownerId});
};

const updateProject = async (projectId, { ownerId, ...data }) => {
  let project = await projectDao.getProject(projectId);
  if (!project) throw new CustomError(errorCodes.PROJECT_NOT_FOUND);

  if (String(project.ownerId) !== ownerId) {
    const owner = await userDao.findUser(ownerId);
    if (!owner)
      throw new CustomError(errorCodes.USER_NOT_FOUND, 'Owner is not found');
  }

  project = await projectDao.updateProject(projectId, { ...data, ownerId });
  return project;
};

const updateProjectCameras = async (projectId) => {
  const cameras = await cameraDao.getCameras({ projectId });
  await projectDao.updateProject(projectId, { cameras });
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  createProject,
  updateProject,
  updateProjectCameras,
};
