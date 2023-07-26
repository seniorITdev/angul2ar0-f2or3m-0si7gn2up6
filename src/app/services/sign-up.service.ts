import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ThumbnailResType } from '../interfaces/thumbnailResType';
import { UserResType, UserType } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  private domainUrl = 'https://jsonplaceholder.typicode.com';
  private userData = new Subject<UserType>();

  userData$ = this.userData.asObservable();

  constructor(
    private httpClient: HttpClient,
  ) { 
    this.userData$.pipe(
      switchMap((user) => combineLatest([this.getThumbnailData(user.lastName.length), of(user)])),
      switchMap(([thumbnailRes, user]) => {
        const userReq: UserType = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          thumbnailUrl: thumbnailRes.thumbnailUrl,
        };
        return this.saveUser(userReq);
      }),
    ).subscribe((res) => {
      console.log(res);
    })
  }

  getThumbnailData(length: number): Observable<ThumbnailResType> {
    return this.httpClient.get<ThumbnailResType>(`${this.domainUrl}/photos/${length}`);
  }

  saveUser(user: UserType): Observable<UserResType> {
    return this.httpClient.post<UserResType>(`${this.domainUrl}/users`, { user });
  }

  setUserData(userInfo: UserType): void {
    this.userData.next(userInfo);
  }
}
