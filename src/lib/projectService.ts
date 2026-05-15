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

export const projectService = {
  async createProject(project: Partial<Project>) {
    try {
      const projectRef = doc(collection(db, PROJECTS_COLLECTION), project.id);
      const projectData = {
        ...project,
        createdAt: Date.now(), // rules check for number or use serverTimestamp if rules allow
        updatedAt: Date.now(),
      };
      await setDoc(projectRef, projectData);
      return projectData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PROJECTS_COLLECTION);
    }
  },

  async getProjectsByUser(userId: string) {
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

  async saveProject(projectId: string, canvasData: any, thumbnail?: string) {
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

  async deleteProject(projectId: string) {
    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, PROJECTS_COLLECTION);
    }
  }
};
