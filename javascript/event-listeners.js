const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
}

elements.sidebarToggle.addEventListener("click", function() {
  mutations.toggleSidebar();
  if (state.sidebarOpen) {
    elements.sidebar.classList.add('-translate-x-full');
    elements.sidebarToggle.classList.add('rotate-180');
  } else {
    elements.sidebar.classList.remove('-translate-x-full');
    elements.sidebarToggle.classList.remove('rotate-180');
  }
});
