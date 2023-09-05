const state = {
  sidebarOpen: false,
};

const mutations = {
  toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
  },
};

const getters = {
  sidebarOpen: () => state.sidebarOpen,
};