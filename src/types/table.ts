export type TableInfo = {
  title: string;
  key: string;
  render?: (value: string) => React.ReactNode;
  className?: string;
};
