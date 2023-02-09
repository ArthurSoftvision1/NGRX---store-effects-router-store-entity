import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { autoLogin, autoLogout, loginStart, loginSuccess, signupStart, signupSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, of, tap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { AuthResponseData } from "src/app/models/AuthResponseData.model";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { AppState } from "src/app/store/app.state";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions,
        private authService: AuthService,
        private store: Store<AppState>,
        private router: Router) { }

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action: { email: string, password: string }) => {
                return this.authService.login(action.email, action.password).pipe(
                    map((data: AuthResponseData) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }))
                        this.store.dispatch(setErrorMessage({ message: '' }));
                        const user = this.authService.formatUser(data);
                        this.authService.setUserInLocalStorage(user);
                        return loginSuccess({ user, redirect: true });
                    }),
                    catchError((errResp) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }))
                        const errorMessage = this.authService.getErrorMessage(
                            errResp?.error?.error?.message
                        )
                        return of(setErrorMessage({ message: errorMessage }));
                    })

                )
            })
        )
    })

    loginRedirect$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(...[loginSuccess, signupSuccess]),
                tap((action) => {
                    this.store.dispatch(setErrorMessage({ message: '' }))
                    if (action.redirect) {
                        this.router.navigate(['/'])
                    }
                })
            )
        },
        { dispatch: false }
    );

    signUp$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(signupStart),
            exhaustMap((action: { email: string, password: string }) => {
                return this.authService.signUp(action.email, action.password).pipe(
                    map((data: AuthResponseData) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }))
                        this.store.dispatch(setErrorMessage({ message: '' }));
                        const user = this.authService.formatUser(data);
                        this.authService.setUserInLocalStorage(user);
                        return signupSuccess({ user, redirect: true });
                    }),
                    catchError((errResp) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }))
                        const errorMessage = this.authService.getErrorMessage(
                            errResp.error.error.message
                        )
                        return of(setErrorMessage({ message: errorMessage }));
                    })
                )
            })
        )
    })

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(autoLogin),
            mergeMap((action) => {
                const user: any = this.authService.geUserFomLocalStorage();
                return of(loginSuccess({ user, redirect: false }))
            })
        )
    },
    )

    logout$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(autoLogout),
                map((action) => {
                    this.authService.logout();
                    this.router.navigate(['auth']);
                })
            )
        }, { dispatch: false })
}