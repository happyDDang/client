import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    memberNo: null as number | null,
  }),
  actions: {
    setMemberNo(memberNo: number) {
      this.memberNo = memberNo;
    },
  },
  //   persist: true, // 새로고침 후에도 유지하고 싶다면 사용 가능
});
