export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: string;
  visible?: boolean;
  cssClasses?: string[];
}
