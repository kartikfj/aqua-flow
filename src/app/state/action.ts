import { createAction, props } from '@ngrx/store';
import { Project, ProjectChild } from "../model/Project";

export const fetchProject = createAction('[Project] Fetch Projects');
export const fetchProjectSuccess = createAction(
    '[Project] Fetch Projects Success',
    props<{projects: Project[]}>()
);

export const fetchProjectFailure = createAction('[Project] Fetch Project Failure',props<{error: any}>());

export const saveProject = createAction('[Project Save Project',props<{project:Project}>());
export const saveProjectSuccess = createAction('[Project] Save Project Success',props<{project:Project}>());
export const saveProjectFailure = createAction('[Project] Save Project Failure',props<{error:any}>());


export const fetchProjectChildData = createAction(
    '[Project] Fetch Project Child Data',
    props<{projectId:number}>()
);

export const fetchProjectChildDataSuccess = createAction(
    '[Project] Fetch Project Child Data Success',
    props<{projectId:number;children:ProjectChild[]}>()
);
export const fetchProjectChildDataFailure=createAction(
    '[Project] Fetch Project Child Data Failure',
    props<{error:any}>()
)



export const saveProjectChildData = createAction('[Project Save Project Child',props<{packageData:ProjectChild}>());
export const saveProjectChildDataSuccess = createAction('[Project] Save Project Child Success',props<{projectChild:ProjectChild}>());
export const saveProjectChildDataFailure = createAction('[Project] Save Project Child Failure',props<{error:any}>());


export const updateProjectChildData = createAction('[Project] Update Project Child Data', props<{ packageData: ProjectChild }>());
export const updateProjectChildDataSuccess = createAction('[Project] Update Project Child Data Success', props<{ projectChild: ProjectChild }>());
export const updateProjectChildDataFailure = createAction('[Project] Update Project Child Data Failure', props<{ error: any }>());

