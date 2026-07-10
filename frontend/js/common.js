const API_BASE = "http://localhost:8000";

// Standard function to fetch from API with session credentials
async function apiFetch(url, options = {}) {
    options.credentials = 'include';
    if (options.body && !(options.body instanceof FormData)) {
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
    }
    const response = await fetch(API_BASE + url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Function to fetch current user
async function getCurrentUser() {
    try {
        const data = await apiFetch('/api/currUser');
        return data.user;
    } catch (e) {
        console.error("Failed to load user state:", e);
        return null;
    }
}

// Render dynamic navbar
function renderNavbar(currUser) {
    const navbarHTML = `
    <nav class="navbar navbar-expand-md bg-body-light border-bottom sticky-top" style="background: white;">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html"><i class="fa-regular fa-compass" style="color: #fe424d; font-size: 1.8rem;"></i></a>
        <a href="index.html" style="text-decoration: none;"><h4 style="color: #fe424d; font-family: 'Plus Jakarta Sans', sans-serif !important; margin: 0 1rem 0 0.5rem; font-weight: 700;">HostHive</h4></a>
    
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav ms-auto">
            <div class="navbar-nav align-items-center">
              <form class="d-flex align-items-center me-3" role="search" id="search-form">
                <input
                  class="form-control me-2 search-inp"
                  type="search"
                  placeholder="Search Destination"
                  id="searchQuery" 
                  name="searchQuery" 
                  style="border-radius: 25px; padding: 0.4rem 1.5rem;"
                />
                <button class="btn search-btn btn-danger" type="submit" style="border-radius: 25px; background: #fe424d; border: none;">
                  <i class="fa-solid fa-magnifying-glass"></i> Search
                </button>
              </form>
              <a class="nav-link" href="new.html" style="color: #333; font-weight: 500; margin-right: 1rem;">Rent your home</a>
              ${!currUser ? `
                <a class="nav-link" href="signup.html" style="color: #333; font-weight: 600; margin-right: 1rem;">Sign up</a>
                <a class="nav-link" href="login.html" style="color: #fe424d; font-weight: 600;">Log in</a>
              ` : `
                <span class="me-3 text-muted">Hello, <b>${currUser.username}</b></span>
                <a class="nav-link" href="#" id="logout-btn" style="color: #fe424d; font-weight: 600;">Log out</a>
              `}
            </div>
          </div>
        </div>
      </div>
    </nav>
    `;
    
    // Inject at the beginning of body or inside header container
    let header = document.getElementById('navbar-container');
    if (!header) {
        header = document.createElement('div');
        header.id = 'navbar-container';
        document.body.insertBefore(header, document.body.firstChild);
    }
    header.innerHTML = navbarHTML;

    // Attach search event
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchQuery').value.trim();
            if (query) {
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Attach logout event
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await apiFetch('/api/logout', { method: 'POST' });
                showToast("Success", "Logged out successfully!", "success");
                setTimeout(() => window.location.href = 'index.html', 1000);
            } catch (err) {
                showToast("Error", err.message, "danger");
            }
        });
    }
}

// Render dynamic footer
function renderFooter() {
    const footerHTML = `
    <footer style="background-color: #242222; color: white; padding: 40px 20px 20px; margin-top: 50px;">
      <div class="container text-center">
        <div class="d-flex justify-content-center mb-3">
          <a href="#" style="color: white; font-size: 1.5rem; margin: 0 15px;"><i class="fa-brands fa-linkedin"></i></a>
          <a href="#" style="color: white; font-size: 1.5rem; margin: 0 15px;"><i class="fa-brands fa-instagram"></i></a>
        </div>
        <ul style="list-style: none; padding: 0; display: flex; justify-content: center; margin-bottom: 20px;">
          <li><a href="index.html" style="color: #bbb; text-decoration: none; margin: 0 15px;">Home</a></li>
          <li><a href="#" style="color: #bbb; text-decoration: none; margin: 0 15px;">Privacy</a></li>
          <li><a href="#" style="color: #bbb; text-decoration: none; margin: 0 15px;">Company details</a></li>
        </ul>
        <p class="m-0 text-muted">&copy; HostHive Private Limited</p>
      </div>
    </footer>
    `;
    let footer = document.getElementById('footer-container');
    if (!footer) {
        footer = document.createElement('div');
        footer.id = 'footer-container';
        document.body.appendChild(footer);
    }
    footer.innerHTML = footerHTML;
}

// Show user alerts / toasts
function showToast(title, message, type = "success") {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        tc.className = 'position-fixed bottom-0 end-0 p-3';
        tc.style.zIndex = '1100';
        document.body.appendChild(tc);
    }

    const toastHTML = `
      <div class="toast align-items-center text-white bg-${type} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}:</strong> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    const toastEl = document.createElement('div');
    toastEl.innerHTML = toastHTML.trim();
    document.getElementById('toast-container').appendChild(toastEl.firstChild);
    
    // Auto dismiss after 4s
    setTimeout(() => {
        const openToast = document.querySelector('.toast.show');
        if (openToast) {
            openToast.classList.remove('show');
            openToast.remove();
        }
    }, 4000);
}

// Setup common layout (run automatically)
document.addEventListener("DOMContentLoaded", async () => {
    const user = await getCurrentUser();
    renderNavbar(user);
    renderFooter();
});
