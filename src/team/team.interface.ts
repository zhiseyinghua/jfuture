import { UserInfo, UserInfoInterface, UserInterface } from "src/user/user.interface";

export interface TeamInfo {
    hash: string;
    range: string;
    index: string;   
  }
export interface TeamInfoInterface {
  hash?: string;
  range?: string;
  index?: string;   
  UserInfo?:UserInfoInterface;
  UserIndex?:UserInfo;
  teamname:string,
  projectname:string,
  projectprogress:string,
  membername:any,
  role?:  'member' | 'admin' | 'owner',
  TeamIndex?:TeamInfo,
}