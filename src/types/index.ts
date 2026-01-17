export interface NotifInfo {
  id?: number;
  packageName: string;
  heading: string;
  bodyText: string;
  time: number;
}

export interface AppInfo {
  packageName: string;
  appName: string;
  iconBase64?: string | null;
}

export type RootDrawerParamList = {
  Home: undefined;
  AllNotifications: undefined;
  AppWiseNotifications: undefined;
  AppNotifications: { packageName: string };
};
