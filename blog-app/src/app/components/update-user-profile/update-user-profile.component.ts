import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {UsersService} from "../../services/users.service";
import {HttpEventType} from "@angular/common/http";

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}
@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {
  //@ts-ignore
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  public file: File = {
    data: null,
    progress: 0,
    inProgress: false
  }
  public updateForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private usersService: UsersService
  ) {}
  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: [null]
    });
    this.authService.getUserId().pipe(
      switchMap((id: number) => this.usersService.findOne(id).pipe(
        tap((user) => {
            this.updateForm.patchValue({
              id: user.id,
              name: user.name,
              username: user.username
            })
        })
      ))
    ).subscribe();
  }

  public onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      }
      this.fileUpload.nativeElement.value = '';
      this.uploadFile();
    }
  }

  public updateUserProfile() {
    this.usersService.updateOne(this.updateForm.getRawValue()).subscribe();
  }

  private uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.usersService.uploadProfileImage(formData).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error) => {
        this.file.inProgress = false;
        return of('Upload failed')
      })
    ).subscribe((event: any) => {
        if (typeof event === 'object') {
          this.updateForm.patchValue({profileImage: event.body.profileImage})
        }
    })
  }
}
