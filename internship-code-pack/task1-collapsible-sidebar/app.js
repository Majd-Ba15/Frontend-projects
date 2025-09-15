/**
 * Collapsible Sidebar: accessible toggle + focus management
 */
const body = document.body;
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const backdrop = document.getElementById('backdrop');

function openSidebar(){
  body.classList.add('sidebar-open');
  toggleBtn.setAttribute('aria-expanded','true');
  // Move focus to the first nav link for accessibility
  const firstLink = sidebar.querySelector('.nav-link');
  firstLink && firstLink.focus();
  backdrop.hidden = false;
}
function closeSidebar(){
  body.classList.remove('sidebar-open');
  toggleBtn.setAttribute('aria-expanded','false');
  toggleBtn.focus();
  backdrop.hidden = true;
}
function toggleSidebar(){
  body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
}

toggleBtn.addEventListener('click', toggleSidebar);
backdrop.addEventListener('click', closeSidebar);

// ESC to close when open
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && body.classList.contains('sidebar-open')){
    closeSidebar();
  }
});
