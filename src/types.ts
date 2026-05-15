export enum ProjectType {
  SOCIAL_POST = 'social_post',
  STORY = 'story',
  REEL = 'reel',
  PRESENTATION = 'presentation',
  FLYER = 'flyer',
  LOGO = 'logo',
  VIDEO = 'video',
  WEBSITE = 'website',
  MOCKUP = 'mockup'
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  canvasData: any; // Fabric.js JSON
  thumbnail?: string;
  isPublic?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  username?: string;
  workspaceId: string;
}

export const DESIGN_TEMPLATES = [
  { id: '1', name: 'Instagram Post', type: ProjectType.SOCIAL_POST, width: 1080, height: 1080, icon: 'Instagram' },
  { id: '2', name: 'Story', type: ProjectType.STORY, width: 1080, height: 1920, icon: 'Smartphone' },
  { id: '3', name: 'Presentation', type: ProjectType.PRESENTATION, width: 1920, height: 1080, icon: 'Presentation' },
  { id: '4', name: 'Logo', type: ProjectType.LOGO, width: 500, height: 500, icon: 'Zap' },
  { id: '5', name: 'Flyer', type: ProjectType.FLYER, width: 2480, height: 3508, icon: 'FileText' }, // A4
  { id: '6', name: 'YouTube Thumbnail', type: ProjectType.SOCIAL_POST, width: 1280, height: 720, icon: 'Youtube' },
];
