import { createReducer, on } from "@ngrx/store";
import * as ProjectActions from '../state/action';
import { Project, ProjectChild } from '../model/Project';


export interface ProjectState{
    projects:Project[];
    loading:boolean;
    error:any;
}

export const initialState:ProjectState={
    projects:[],
    loading:false,
    error:null,
}
export interface ProjectChildState{
    childProjects:ProjectChild[];
    loading:boolean;
    error:any;
}

export const initialChildState:ProjectChildState={
    childProjects:[],
    loading:false,
    error:null,
}


export const projectReducer = createReducer(
    initialState,
    on(ProjectActions.fetchProject,state=>({...state,loading:true})),
    on(ProjectActions.fetchProjectSuccess,(state,{projects})=>({
        ...state,
        projects,
        loading:false,
        error:null,
    })),
    on(ProjectActions.fetchProjectFailure,(state,{error})=>({
        ...state,
        loading:false,
        error,
    })),
    on(ProjectActions.saveProjectSuccess,(state,{project})=>({
        ...state,
        projects:[...state.projects,project],
        loading:false,
    })),
    on(ProjectActions.fetchProjectChildDataSuccess,(state,{projectId,children})=>{
       const updateProjects=state.projects.map(project=>
        project.id===projectId ? {...project,children}:project
       );
       return {...state,projects:updateProjects};
    }),
    
)

export const projectChildReducer = createReducer(
    initialChildState,
    on(ProjectActions.fetchProjectChildData, state => ({ ...state, loading: true })),
    on(ProjectActions.fetchProjectChildDataSuccess, (state, { children }) => ({
        ...state,
        childProjects: children,
        loading: false,
    })),
    on(ProjectActions.saveProjectChildDataSuccess, (state, { projectChild }) => ({
        ...state,
        childProjects: [...state.childProjects, projectChild], 
        loading: false,
    })),
    on(ProjectActions.updateProjectChildDataSuccess, (state, { projectChild }) => ({
        ...state,
        childProjects: [...state.childProjects, projectChild],
        loading: false,
    })),
    on(ProjectActions.saveProjectChildDataFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(ProjectActions.updateProjectChildDataFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);

