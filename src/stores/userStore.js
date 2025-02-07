import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    memberNo: null,
  }),
  actions: {
    setMemberNo(memberNo) {
      this.memberNo = memberNo;
    },
  },
});
