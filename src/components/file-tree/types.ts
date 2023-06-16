export type DataNode = {
  name: string;
  kind: "directory" | "file";
  children?: DataNode[];
  size?: string;
  modified?: string;
};
