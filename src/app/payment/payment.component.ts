import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent {
  @Input("time") time;
  @Input("date") date;
  @Input("venue") venue;
  @Input("payment") payment; 

  public teamMemberValue;
  public userRef;
  public userInfo;
  public num;

  constructor(
    public db: AngularFireDatabase
  ){}

  enterPayment(time: string, date: string, venue: string, payment: number, teammember: string){
    const gameID = time + date + venue;
    const ref = this.db.list('games/');
    const memberRef = this.db.list('teammembers/');
    ref.update(gameID,
      {
        teamMember: this.teamMemberValue,
        paidAmount: payment
      }
    );
    memberRef.update(this.teamMemberValue,
      {
        teamMemberName: this.teamMemberValue,
      }
    );
    this.userRef = this.db.list('/teammembers', ref => ref.equalTo(teammember).orderByKey())
    this.userRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        this.userInfo = action.payload.val();
        if(this.userInfo.totalPaid == undefined)
        {
          this.num = 0;
        }
        else
        {
          this.num = this.userInfo.totalPaid
        }
        memberRef.update(this.teamMemberValue,
          {
            teamMemberName: this.teamMemberValue,
            totalPaid: this.num + payment
          }
        );
      });
    })
  }
}