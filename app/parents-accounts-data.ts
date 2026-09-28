export type ParentAccount = {
  relation: string;
  holder: string;
  bank: string;
  number: string;
};

export const parentAccountGroups: { title: string; accounts: ParentAccount[] }[] = [
  { title: "신랑 측", accounts: [
    { relation: "어머니", holder: "김현정", bank: "KB국민은행", number: "536202-01-238189" },
    { relation: "아버지", holder: "한동현", bank: "KB국민은행", number: "835-24-0234-967" },
  ] },
  { title: "신부 측", accounts: [
    { relation: "아버지", holder: "이광범", bank: "신한은행", number: "110-342-707013" },
    { relation: "어머니", holder: "성호숙", bank: "하나은행", number: "112-910092-22507" },
  ] },
];
