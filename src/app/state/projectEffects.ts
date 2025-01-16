import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ProjectActions from './action';
import { ProjectService } from '../ProjectService';


@Injectable()
export class ProjectEffects {
  constructor(private actions$: Actions, private projectService: ProjectService) {}

  fetchProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.fetchProject),
      mergeMap(() =>
        this.projectService.getProjects().pipe(
          map(projects => ProjectActions.fetchProjectSuccess({ projects })),
          catchError(error => of(ProjectActions.fetchProjectFailure({ error })))
        )
      )
    )
  );

  saveProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.saveProject),
      mergeMap(action =>
        this.projectService.saveProject(action.project).pipe(
          map(project => ProjectActions.saveProjectSuccess({ project })),
          catchError(error => of(ProjectActions.saveProjectFailure({ error })))
        )
      )
    )
  );

  fetchProjectChildData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.fetchProjectChildData),
      mergeMap(action =>
        this.projectService.getProjectChildData(action.projectId).pipe(
          map(children =>
            ProjectActions.fetchProjectChildDataSuccess({ projectId: action.projectId, children })
          ),
          catchError(error => of(ProjectActions.fetchProjectChildDataFailure({ error })))
        )
      )
    )
  );
  saveChildProject$ = createEffect(() =>
    
    this.actions$.pipe(
      ofType(ProjectActions.saveProjectChildData),
      mergeMap(action =>
        this.projectService.saveChildProject(action.packageData).pipe(
          map(projectChild => ProjectActions.saveProjectChildDataSuccess({ projectChild })),
          catchError(error => of(ProjectActions.saveProjectChildDataFailure({ error })))
        )
      )
    )
  );
  
}
