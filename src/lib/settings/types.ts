export type SettingsActionState = {
  error: string | null;
  success?: boolean;
};

export const initialSettingsActionState: SettingsActionState = {
  error: null,
};
