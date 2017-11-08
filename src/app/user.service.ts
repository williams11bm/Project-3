// import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
// import { catchError, map, tap } from 'rxjs/operators';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
//
// @Injectable()
// export class UserService {
// 
//   constructor(
//     private http: Http,
//
//   ) { }
//
//     /* GET users whose name contains search term */
//   searchUsers(term: string): Observable<any[]> {
//     let headers = new Headers();
//     headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
//     let options = new RequestOptions({headers:headers})
//     if (!term.trim()) {
//       // if not search term, return empty hero array.
//       return Observable.of([]);
//     }
//     return this.http.get<any[]>('http://localhost:3000/api/users/user/'+term,options).pipe(
//       tap(_ => console.log('found users matching '+term))
//     );
//   }
// }
