import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from './reducer';

export const selectProjectState = createFeatureSelector<ProjectState>('projects');

export const selectAllProjects = createSelector(selectProjectState, state => state.projects);

export const selectProjectById = (projectId: number) =>
  createSelector(selectAllProjects, projects => projects.find(project => project.id === projectId));
