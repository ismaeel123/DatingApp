import { Component, HostListener, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../_Models/Member';
import { AccountsService } from '../../_Services/accounts.service';
import { MembersService } from '../../_Services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule,FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?:NgForm
  @HostListener ('window:beforeunload',['$event']) notify($event:any)
  {
    if (this.editForm?.dirty)
        $event.returnValue =true
  }
  member? : Member
  private accountService = inject (AccountsService)
  private memberService = inject (MembersService)
  private toastr = inject (ToastrService)

  ngOnInit(): void {
    const user = this.accountService.CurrentUser();
    if (!user) return;

    this.memberService.getMember(user.username).subscribe({
      next: member => this.member=member
    })
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ =>{
        this.toastr.success('profile updated successfully');
        this.editForm?.reset(this.member);
      }
    })
    
  }


} 