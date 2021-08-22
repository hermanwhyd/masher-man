import { Icon } from '@visurel/iconify-angular';

export interface ListMenu {
  id?: string;
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}
