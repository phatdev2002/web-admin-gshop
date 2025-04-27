export interface News {
    _id: string;
    title: string;
    date: string;
    content: string;
    images?: string[];
    thumbnail?: string;
    id_user: string;
    time: string;
  }