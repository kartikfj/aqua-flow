import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectChildState, ProjectState } from './reducer';

export const selectProjectState = createFeatureSelector<ProjectState>('projects');

export const selectAllProjects = createSelector(selectProjectState, state => state.projects);

export const selectProjectById = (projectId: number) =>
  createSelector(selectAllProjects, projects => projects.find(project => project.id === projectId));



export const selectProjectChildState = createFeatureSelector<ProjectChildState>('childProjects');

export const selectAllChildProjects = createSelector(selectProjectChildState, state => state.childProjects);
