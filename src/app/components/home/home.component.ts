import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import { IChats, IMessage } from 'src/app/models/chat.model';
import { IProfile } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  @ViewChild('endOfChat') endOfChat!:ElementRef
  // selectedChat$:Observable<IChats|undefined>
  user$ = this.userService.currentUserProfile$;
  searchControl = new FormControl('');
  chatListControl = new FormControl('')
  messageControl = new FormControl('');
  myChats$ = this.chatService.myChats$;
  messages$!:Observable<IMessage[]>
  open:boolean=false

  // Declare subscription variables
private createChatSubscription!: Subscription;
private sendMessageSubscription!: Subscription;

  constructor(private userService: UserService,private chatService:ChatService) {}



  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value![0])));

  otherUsers$ = combineLatest([this.userService.allUsers$, this.user$]).pipe(
    map(([users, user]) => users.filter((u) => u.uid !== user?.uid))
  );

  users$ = combineLatest([
    this.otherUsers$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, searchString]) => {
      console.log(users);

      return users.filter((u) =>
        u.displayName?.toLowerCase().includes(searchString!.toLowerCase())
      );
    })
  );

  // createChat(user: IProfile) {
  //   this.chatService
  //     .isExistingChat(user.uid)
  //     .pipe(
  //       switchMap((chatId) => {
  //         if (!chatId) {
  //           return this.chatService.createChat(user);
  //         } else {
  //           return of(chatId);
  //         }
  //       })
  //     )
  //     .subscribe((chatId) => {
  //       this.chatListControl.setValue(chatId)
  //     });
  // }

  createChat(user: IProfile) {
    this.createChatSubscription = this.chatService
      .isExistingChat(user.uid)
      .pipe(
        switchMap((chatId) => {
          if (!chatId) {
            return this.chatService.createChat(user);
          } else {
            return of(chatId);
          }
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue(chatId);
      });
  }

  // sendMessage(){
  //   const message =this.messageControl.value
  //   const selectedChatId = this.chatListControl.value![0];
  //   if(message&& selectedChatId){
  //     this.chatService.addChatMessage(selectedChatId,message).subscribe(()=>{
  //       this.scrollToBottom();
  //     })
  //     this.messageControl.setValue('')
  //   }

  // }
  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl.value![0];
    if (message && selectedChatId) {
      this.sendMessageSubscription = this.chatService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {
          this.scrollToBottom();
        });
      this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  message(chatId:string){
    this.messages$=this.chatService.getChatMessages$(chatId)
  }

  unsubscribe() {
    if (this.createChatSubscription) {
      this.createChatSubscription.unsubscribe();
    }
    if (this.sendMessageSubscription) {
      this.sendMessageSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
