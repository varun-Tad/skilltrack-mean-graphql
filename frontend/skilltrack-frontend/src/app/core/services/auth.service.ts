import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN, LOGOUT, ME, REGISTER } from '../../graphql/auth.graphql';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<any>(null);
  loading = signal<boolean>(false);

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) {}

  register(input: any) {
    return this.apollo.mutate({
      mutation: REGISTER,
      variables: { input },
    });
  }

  login(input: any) {
    return this.apollo.mutate({
      mutation: LOGIN,
      variables: { input },
    });
  }

  loadMe() {
    this.loading.set(true);

    return this.apollo
      .watchQuery({
        query: ME,
        fetchPolicy: 'network-only',
      })
      .valueChanges.subscribe({
        next: (res: any) => {
          this.currentUser.set(res.data.me);
          this.loading.set(false);
        },
        error: () => {
          this.currentUser.set(null);
          this.loading.set(false);
        },
      });
  }

  logout() {
    this.apollo
      .mutate({
        mutation: LOGOUT,
      })
      .subscribe(() => {
        this.currentUser.set(null);
        this.apollo.client.clearStore();
        this.router.navigate(['/login']);
      });
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  isInstructorOrAdmin() {
    const user = this.currentUser();
    return user?.role === 'instructor' || user?.role === 'admin';
  }
}
