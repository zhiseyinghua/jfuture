import { AuthuserInterface } from "src/auth/auth.interface";
import { Dbinterface } from "src/common/db.elasticinterface";
import { UserInfo, UserInfoInterface, UserInterface } from "src/user/user.interface";

export interface TeamInfo {
    hash: string;
    range: string;
    index: string;  
    role:string
  }
export interface TeamInfoInterface {
  hash?: string;
  range?: string;
  index?: string;
  teamMemberKey?:TeamInfo,   
  teamname:string,
  projectname:string,
  projectprogress:string,
  // membername:any,
}
export interface NTeamInfoInterface {
  hash?: string;
  range?: string;
  index?: string;   
  teamname:string,
  projectname:string,
  projectprogress:string,
  // membername:any,
  TeamMemberKey?:TeamInfo,
}
export interface TeamMember{
  hash?:string;
  range?:string;
  index?:string; 
  TeamMemberName:string;
  TeamKey:TeamInfo;
  AuthKey: Dbinterface;
  role:'member'|'admin'|'owner'
}