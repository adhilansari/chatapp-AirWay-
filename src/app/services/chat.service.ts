import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { IProfile } from '../models/user.model';
import { Observable, concatMap, map, take } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { IChats, IMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private userService:UserService,private fireStore:Firestore) { }

   //CREATING CHAT
   createChat(otherUser: IProfile): Observable<string> {
    const ref = collection(this.fireStore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIds: [user?.uid, otherUser?.uid],
          users: [
            {
              displayName: user?.displayName ?? '',
              photoURL: user?.photoURL ?? '',
            },
            {
              displayName: otherUser.displayName ?? '',
              photoURL: otherUser.photoURL ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

// MY CHAT
get myChats$(): Observable<IChats[]> {
  const ref = collection(this.fireStore, 'chats');
  return this.userService.currentUserProfile$.pipe(
    concatMap((user) => {
      const myQuery = query(
        ref,
        where('userIds', 'array-contains', user?.uid)
      );
      return collectionData(myQuery, { idField: 'id' }).pipe(
        map((chats: any) => this.addChatNameAndPic(user?.uid, chats))
      ) as Observable<IChats[]>;
    })
  );
}

  addChatNameAndPic(currentUserId:string|undefined,chats:IChats[]){
    chats.forEach(chat=>{
      const otherIndex= chat.userIds.indexOf(currentUserId!)===0 ? 1:0;
      const {displayName,photoURL}  = chat.users[otherIndex];
      chat.chatName = displayName!;
      chat.chatPic=photoURL
    })
    return chats
  }
  //IF Existing CHATS
  isExistingChat(otherUserId:string):Observable<string|null>{
    return this.myChats$.pipe(
      take(1),
      map(chats=>{
        for (let i = 0; i < chats.length; i++) {
          if(chats[i].userIds.includes(otherUserId)){
            return chats[i].id
          }

        }

        return null
      })
    )
  }

  //ADD CHAT MESSAGE
  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.fireStore, 'chats', chatId, 'messages');
    const chatRef = doc(this.fireStore, 'chats', chatId);
    const today = new Date();
    console.log(today);

    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          text: message,
          senderId: user?.uid,
          sentDate: today,
        })
      ),
      concatMap(() =>
        updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
      )
    );
  };

  //GET CHAT MESSAGE
  getChatMessages$(chatId: string): Observable<IMessage[]> {
    const ref = collection(this.fireStore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<IMessage[]>;
  }
}
