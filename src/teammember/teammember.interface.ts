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
  index?: string;
  teamMemberKey?:Teaminfo,
  teamid:string,   
  teamname:string,
  projectid:string,
  projectname:string,
  projectprogress:string,
  description:string,
  type:'normal'|'corporation'
}

export interface TeamMember{
  hash?:string;
  range?:string;
  index?:string; 
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
}