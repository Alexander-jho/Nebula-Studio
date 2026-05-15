import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from '../types';
import { handleFirestoreError, OperationType } from './errorHandling';

const PROJECTS_COLLECTION = 'projects';
const LOCAL_PROJECTS_KEY = 'nebula_guest_projects';

const getGuestProjects = (): Project[] => {
  const data = localStorage.getItem(LOCAL_PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveGuestProjects = (projects: Project[]) => {
  localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
};

export const projectService = {
  async createProject(project: Partial<Project>) {
    if (project.ownerId === 'guest') {
      const projects = getGuestProjects();
      const newProject = {
        ...project,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Project;
      projects.push(newProject);
      saveGuestProjects(projects);
      return newProject;
    }

    try {
      const projectRef = doc(collection(db, PROJECTS_COLLECTION), project.id);
      const projectData = {
        ...project,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(projectRef, projectData);
      return projectData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PROJECTS_COLLECTION);
    }
  },

  async getProjectsByUser(userId: string) {
    if (userId === 'guest') {
      return getGuestProjects().sort((a, b) => b.updatedAt - a.updatedAt);
    }

    try {
      const q = query(
        collection(db, PROJECTS_COLLECTION),
        where('ownerId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Project);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
      return [];
    }
  },

  async saveProject(projectId: string, canvasData: any, thumbnail?: string, ownerId?: string) {
    if (ownerId === 'guest' || (!ownerId && !db)) { // Fallback to localStorage if no DB or guest
      const projects = getGuestProjects();
      const index = projects.findIndex(p => p.id === projectId);
      if (index !== -1) {
        projects[index] = {
          ...projects[index],
          canvasData,
          thumbnail,
          updatedAt: Date.now()
        };
        saveGuestProjects(projects);
      }
      return;
    }

    try {
      const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
      await updateDoc(projectRef, {
        canvasData,
        thumbnail,
        updatedAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, PROJECTS_COLLECTION);
    }
  },

  async deleteProject(projectId: string, ownerId?: string) {
    if (ownerId === 'guest') {
      const projects = getGuestProjects();
      const filtered = projects.filter(p => p.id !== projectId);
      saveGuestProjects(filtered);
      return;
    }

    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, PROJECTS_COLLECTION);
    }
  }
};
