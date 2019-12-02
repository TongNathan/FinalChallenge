import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any;
  userInfo: any;
  fNameValue: string = '';
  lNameValue: string = '';
  userRef: AngularFireList<any>;

  constructor(
    public afs: AngularFirestore, 
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone, 
    public db: AngularFireDatabase,
  ){
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  SetUserData(user) {
    const memberRef = this.db.list('/users/');
    memberRef.update(user.uid,
      {
        uid: user.uid,
        email: user.email,
      }
    );
  }

  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      this.ngZone.run(() => {
      window.location.reload();
      });
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      this.SetUserData(result.user);
      window.location.reload();
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      window.location.reload();
    })
  }
}
