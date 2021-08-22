export interface Media {
  id: number;
  uuid: string;
  name: string;
  collection: string;
  mimeType: string;
  size: number;
  disk: string;
  file: FileUrl;
  properties: any;
  createdAt: Date;
}

export interface FileUrl {
  thumb: string;
  url: string;
  download: string;
}
