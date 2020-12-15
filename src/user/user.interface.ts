import { Dbinterface } from "src/common/db.elasticinterface";


interface UserInfo {
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
    authKey: Dbinterface;
  }
  
