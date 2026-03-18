export interface TomcatBoardSummaryDto {
  idBoard: string;
  boardName: string;
  ownerPseudo: string;
}

export interface TomcatBoardDto {
    idBoard: string;
    boardName: string;
    ownerPseudo: string;
    members: string[];
    columns: TomcatColumnDto[];
}

export interface TomcatColumnDto {
    idColumn: string;
    columnName: string;
    tasks: TomcatTaskDto[];
}

export interface TomcatTaskDto {
    idTask: string;
    taskName: string;
    description: string;
    assignedTo: string | null;
}

export function mapTomcatToBoardSummaryDto(tomcatDto: TomcatBoardSummaryDto) {
  return {
    id: tomcatDto.idBoard,
    name: tomcatDto.boardName,
    ownerPseudo: tomcatDto.ownerPseudo,
  };
}