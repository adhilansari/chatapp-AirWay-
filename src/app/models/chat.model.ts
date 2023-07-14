import { Timestamp } from "@angular/fire/firestore";
import { IProfile } from "./user.model";

export interface IChats {
  id:string,
  lastMessage?:string,
  lastMessageDate?:Date&Timestamp,
  userIds:string[],
  users:IProfile[],
  //only for display
  chatPic?:string,
  chatName?:string
}

export interface IMessage{
  text:string,
  senderId:string,
    sentDate:Date&Timestamp
}
