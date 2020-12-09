import { dbinterface } from "src/common/db.elasticinterface";


interface UserInfo {
    hash: string;
    range: string;
    index: string;
    
  }
  
  export interface UserInfoInterface  {
    hash: string;
    range: string;
    index: string;
    userid:string;
    usernickname:string;
    telephone:string;
    usermail:string;
    userico:string;
    authKey: dbinterface;
  }
  export interface SearchByUserid{
    userid:string;
  }
  
