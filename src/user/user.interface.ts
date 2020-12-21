import { Dbinterface } from "src/common/db.elasticinterface";
import { TeamInfoInterface } from "src/team/team.interface";


export interface UserInfo {
    hash: string;
    range: string;
    index: string;
    
  }
  
  export interface UserInfoInterface  {
    userid:string;
    usernickname:string;
    telephone:string;
    usermail:string;
    userico:string;
    userpassword:string;
    authKey?: Dbinterface;
    hash?: string;
    range?: string;
    index?: string;
  }
export interface UserInterface{
  userid:string;
    usernickname:string;
    telephone:string;
    usermail:string;
    userico:string;
    userpassword:string;
}
  

