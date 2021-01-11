import { AuthuserInterface } from "src/auth/auth.interface";
import { Dbinterface } from "src/common/db.elasticinterface";
import { UserInfo, UserInfoInterface } from "src/user/user.interface";


  export interface Teaminfo {
    hash: string;
    range: string;
    index: string;  
  }
  export interface TeamInfo{
    TeamKey:Teaminfo;
    AuthKey: Dbinterface;
  }
  export interface Teamminterface{
    hash: string;
    range: string;
    index: string; 
    role: 'menber' | 'admin' | 'our',
    TeamKey:Teaminfo;
    AuthKey: Dbinterface;
  }
export interface TeamInfoInterface {
  hash?: string;
  range?: string;
<<<<<<< HEAD
  index?: string;
  teamMemberKey?:Teaminfo,
  teamid:string,   
=======
  index?: string; 
  type: 'nomal' | 'cooperation', 
  teamid:string;
>>>>>>> f81020089ba03434bde270547f5321cd17e14992
  teamname:string,
  projectid:string,
  projectname:string,
  projectprogress:string,
<<<<<<< HEAD
  description:string,
  type:'normal'|'corporation'
}

=======
  startdata:Date,
  enddate:Date
  TeamMemberKey?:Teaminfo,
  // membername:any,
}
>>>>>>> f81020089ba03434bde270547f5321cd17e14992
export interface TeamMember{
  hash?:string;
  range?:string;
  index?:string; 
<<<<<<< HEAD
  TeamKey?:Teaminfo;
  AuthKey?: Dbinterface;
  TeamMemberName:string;
  role?: 'menber' | 'admin' | 'our',
  gender:'man' | 'woman',
  age:string,
  position:string,
  img:string,
  description:string,
  birth:string,
=======
  gender:'man' | 'woman',
  age:string,
  TeamMemberName:string;
  position:string;
  TeamKey:Teaminfo;
  AuthKey: Dbinterface;
  role: 'menber' | 'admin' | 'our'
>>>>>>> f81020089ba03434bde270547f5321cd17e14992
}
