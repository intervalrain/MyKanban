export interface Mission {
    id: string;
    title: string;
    category: string;
    boardId: string;
    urgency: number;
    content: string;
    createdDate: Date;
    dueDate: Date;
    timeNeed: number;
  }
  
  export interface Board {
    id: string;
    name: string;
  }