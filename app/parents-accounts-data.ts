export type ParentAccount = {
  holder: string;
  bank: string;
  number: string;
};

export const parentAccountGroups: { title: string; accounts: ParentAccount[] }[] = [
  { title: "신랑 측", accounts: [] },
  { title: "신부 측", accounts: [] },
];
