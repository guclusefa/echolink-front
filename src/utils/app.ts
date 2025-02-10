/**
 * Get the name of the app
 */
export function getAppName(): string {
  return import.meta.env.VITE_APP_NAME;
}

/**
 * Get the version of the app
 */
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION;
}

/**
 * Get the url of the app
 */
export function getAppUrl(): string {
  return import.meta.env.VITE_APP_URL;
}

/**
 * Get the state of the app sidebar
 */
export function isAppSidebarToggled(): boolean {
  return localStorage.getItem('sidebarToggled') === 'true';
}

/**
 * Toggle the sidebar
 */
export function toggleAppSidebar(): void {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const container = document.getElementById('container');
  if (!body || !sidebar || !container) {
    return;
  }
  // Get the value of the sidebar toggled
  const sidebarToggled = sidebar.classList.contains('!ml-[-16rem]');
  // Toggle the sidebar and the container. Setting inert to the sidebar when it is closed to prevent the focus on the elements inside it
  sidebarToggled ? body.classList.add('sidebar-toggled') : body.classList.remove('sidebar-toggled');
  sidebarToggled ? sidebar.removeAttribute('inert') : sidebar.setAttribute('inert', '');
  // Toggle the sidebar and the container
  sidebar.classList.toggle('!ml-[-16rem]');
  container.classList.toggle('xl:ml-64');
  // Save the value of the sidebar toggled
  localStorage.setItem('sidebarToggled', sidebarToggled.toString());
}

/**
 * Toggle the sidebar transition
 */
export function toggleAppSidebarTransition(): void {
  const sidebar = document.getElementById('sidebar');
  const container = document.getElementById('container');
  if (!sidebar || !container) {
    return;
  }
  // Toggle transition for the sidebar
  sidebar.classList.add('transition-all');
  sidebar.classList.add('duration-300');
  // Toggle transition for the container
  container.classList.add('transition-all');
  container.classList.add('duration-300');
}

/**
 * Toggle the sidebar and the sidebar transition
 */
export function toggleAppSidebarWithTransition(): void {
  toggleAppSidebarTransition();
  toggleAppSidebar();
}

/**
 * Toggle the sidebar and the sidebar transition only if the screen is mobile
 */
export function toggleAppSidebarWithTransitionOnMobile(): void {
  if (window.innerWidth <= 1280) {
    toggleAppSidebarTransition();
    toggleAppSidebar();
  }
}
