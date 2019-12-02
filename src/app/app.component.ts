import { Component } from '@angular/core';
import { AuthService } from "../app/auth/auth.service";
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  games: Observable<any[]>;
  teamMembers: Observable<any[]>;
  emailValue: string = '';
  passwordValue: string = '';
  currentDate = new Date();
  teamMemberValue: string = '';
  otherDate: string = '02';

  public timeValue;
  public dateValue;
  public venueValue;
  public userRef;
  public userInfo;

  loggedIn: boolean = false;
  loggedOut: boolean = true;

  constructor(
    public authService: AuthService,
    public db: AngularFireDatabase
  ){ }

  ngOnInit() {
    this.checkIfLoggedIn();
    this.games = this.db.list('games').valueChanges();
    this.teamMembers = this.db.list('teammembers').valueChanges();
  }

  login() {
    this.authService.SignIn(this.emailValue, this.passwordValue)
    this.games = this.db.list('games').valueChanges();
    this.teamMembers = this.db.list('teammembers').valueChanges();
  }

  register() {
    this.authService.SignUp(this.emailValue, this.passwordValue)
  }

  logout() {
    this.authService.SignOut()
  }

  checkIfNewGame(date) {
    date = date.replace('-', '');
    date = date.replace('-', '');

    let currentMonth = this.currentDate.getMonth() + 1;
    let dateString = this.currentDate.getFullYear() + '' + currentMonth + '' + this.otherDate;
    let currentDate = +dateString;
    if (currentDate <= date) {
      return true;
    }
    else {
      return false;
    }
  }

  checkIfOldGame(date) {
    date = date.replace('-', '');
    date = date.replace('-', '');

    let currentMonth = this.currentDate.getMonth() + 1;
    let dateString = this.currentDate.getFullYear() + '' + currentMonth + '' + this.otherDate;
    let currentDate = +dateString;
    if (currentDate > date) {
      return true;
    }
    else {
      return false;
    }
  }

  checkIfLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.loggedIn = true;
      this.loggedOut = false;
    }
    else {
      this.loggedIn = false;
      this.loggedOut = true;
    }
  }

  createGame() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.userRef = this.db.list('/users', ref => ref.equalTo(user.uid).orderByKey())
      this.userRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          this.userInfo = action.payload.val();
          if (this.userInfo.admin === true) {
            let id = this.timeValue + this.dateValue + this.venueValue;
            const gameRef = this.db.list('/games/');
            gameRef.update(id,
              {
                time: this.timeValue,
                date: this.dateValue,
                venue: this.venueValue,
                teamMember: '',
                paidAmount: 0
              }
            );
          }
          else {
            console.log("Not admin");
          }
        });
      })
    }
  }

  deleteGame(time: string, date: string, venue: string) {
    const gameID = time + date + venue;
    this.db.list('games/' + gameID).remove()
  }

  checkIfPaid(teammember: string, paidamount: number) {
    if (teammember != '') {
      return "Paid by " + teammember + ". Amount paid: $" + paidamount;
    }
    else {
      return "Currently unpaid.";
    }
  }
}
