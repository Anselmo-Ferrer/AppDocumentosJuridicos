export type RootStackParamList = {
  Start: undefined;
  LoginAccount: undefined;
  CreateAccount: undefined;
  Casos: { user: { email: string; id: string } };
  CreateCaso: { user: { email: string; id: string } };
  Documents: { user: { email: string; id: string }; caso: string };
  NewDocument: { user: { email: string; id: string }; caso: string };
  Send: { user: { email: string; id: string } };
};