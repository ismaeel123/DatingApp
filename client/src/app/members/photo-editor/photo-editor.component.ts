import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_Models/Member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AccountsService } from '../../_Services/accounts.service';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_Models/Photo';
import { MembersService } from '../../_Services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,NgStyle,FileUploadModule,DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  
  private accountService =inject(AccountsService)
  private memberService =inject (MembersService)
  uploader?:FileUploader
  hasBaseDropZoneOver =false;
  baseUrl =environment.apiUrl;
  member = input.required<Member>();
  memberChange = output<Member>();


  ngOnInit(): void {
    this.initializeUploader()
  }

  fileOverBase (e:any)
  {
    this.hasBaseDropZoneOver=e;
  }

  setMainPhoto (photo : Photo){
    this.memberService.setMainPhoto(photo).subscribe({
      next: _ =>{
        const user =this.accountService.CurrentUser()
        if (user)
        {
          user.photoUrl = photo.url
          this.accountService.setCurrentUser(user)
        }
        const updatedMember ={...this.member()}
        updatedMember.photoUrl =photo.url
        updatedMember.photos.forEach(p => {
          if (p.isMain ) p.isMain=false
          if (p.id === photo.id) p.isMain=true
        });
        this.memberChange.emit(updatedMember)
      }
    })
  }

  deletePhoto (photo :Photo){
    this.memberService.deletePhoto(photo).subscribe({
      next: _ => {
        const updatedMember = {...this.member()}
        updatedMember.photos=updatedMember.photos.filter (p => p.id !== photo.id)
        this.memberChange.emit(updatedMember);
      }
    })
  }
  
  initializeUploader(){
    this.uploader = new FileUploader ({
      url:this.baseUrl +'users/add-photo',
      authToken:'bearer '+this.accountService.CurrentUser()?.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10 * 1024 * 1024
    }),

    this.uploader.onAfterAddingFile = (file)=>{
      file.withCredentials=false;
    }

    this.uploader.onSuccessItem = (item,response,status,headers) =>{
      const photo =JSON.parse (response)
      const UpdatedMember  ={...this.member()}
      UpdatedMember.photos.push(photo)
      this.memberChange.emit(UpdatedMember)
      if (photo.isMain){
        const user =this.accountService.CurrentUser()
        if (user)
        {
          user.photoUrl = photo.url
          this.accountService.setCurrentUser(user)
        }
        UpdatedMember.photoUrl =photo.url
        UpdatedMember.photos.forEach(p => {
          if (p.isMain ) p.isMain=false
          if (p.id === photo.id) p.isMain=true
        });
        this.memberChange.emit(UpdatedMember)
      }
    }
    
  }


}
