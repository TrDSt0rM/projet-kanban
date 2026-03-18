export interface TomcatUserDto {
  pseudo: string;
  password: string;
  userRole: string; // "USER" ou "ADMIN"
  active: boolean;  // true ou false
}

export function mapTomcatToUserEntity(tomcatData: TomcatUserDto) {
  return {
    pseudo: tomcatData.pseudo,
    password: tomcatData.password,
    role: tomcatData.userRole,               // userRole -> role
    isActive: tomcatData.active
  };
}