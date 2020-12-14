<<<<<<< HEAD
import { dbinterface } from "src/common/db.elasticinterface";
=======
import { Dbinterface } from "src/common/db.elasticinterface";
>>>>>>> dev-hxy


interface UserInfo {
    hash: string;
    range: string;
    index: string;
    
  }
  
  export interface UserInfoInterface  {
<<<<<<< HEAD
    hash: string;
    range: string;
    index: string;
=======

>>>>>>> dev-hxy
    userid:string;
    usernickname:string;
    telephone:string;
    usermail:string;
    userico:string;
<<<<<<< HEAD
    authKey: dbinterface;
  }
  export interface SearchByUserid{
    userid:string;
  }
  
=======
    authKey: Dbinterface;
  }
  
>>>>>>> dev-hxy
