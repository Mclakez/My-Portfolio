// ===== INTERSECTION OBSERVER FOR SUBTLE FADE-INS =====
// This creates a subtle fade-in effect as elements enter the viewport

// Why use Intersection Observer instead of scroll events?
// - Better performance: only triggers when elements actually enter/exit view
// - Browser-optimized: the browser handles the heavy lifting
// - More efficient: doesn't constantly check scroll position

const projectContainer = document.querySelector('.project-list')
const themeToggleBtn = document.querySelector('.theme-toggle')
const rootEl = document.documentElement
const crescent = document.querySelector('.theme-toggle svg')

document.addEventListener('DOMContentLoaded', async () => {
    await getProjects()
})

let isDark = localStorage.getItem('theme')


//Check local storage is set to dark mode
if (isDark === 'dark') {
    rootEl.classList.add('dark')
} else if (isDark === 'light') {
    rootEl.classList.add('light')
}


const observerOptions = {
    threshold: 0.15,  // Trigger when 15% of element is visible
    rootMargin: '0px' // No offset, triggers exactly when element enters viewport
};

// This callback function runs whenever an observed element enters/exits the viewport
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        // If element is intersecting (entering viewport)
        if (entry.isIntersecting) {
            // Add 'visible' class which triggers the CSS animation
            entry.target.classList.add('visible');
            
            // Stop observing this element (performance optimization)
            // Once it's faded in, we don't need to watch it anymore
            observer.unobserve(entry.target);
        }
    });
};

// Create the observer with our options and callback
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Select all elements we want to animate
const animatedElements = document.querySelectorAll(
    '.project-item, .skill-group'
);

// Start observing each element
animatedElements.forEach(element => {
    // Add the 'fade-in' class (sets initial hidden state in CSS)
    element.classList.add('fade-in');
    
    // Tell the observer to watch this element
    observer.observe(element);
});


// ===== SMOOTH SCROLL OFFSET =====
// Prevents content from hiding behind fixed elements when using anchor links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" (like logo links to top)
        if (targetId === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ===== PAGE LOAD FADE-IN =====
// Ensures smooth appearance when page first loads

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Small delay to ensure everything is rendered
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});


async function getProjects () {
    projectContainer.innerHTML = ""
    try{
        let res = await fetch("./data.json")
        let data = await res.json()
    
    data.forEach(project => {
        let projectList = document.createElement('li')
        projectList.classList.add('project-item')
        projectList.innerHTML = `
                        <a href="${project.link}" class="project-link">
                            <div class="project-thumbnail">
                                <div class="placeholder" style="background-image:url(${project.image})"></div>
                            </div>
                            <div class="project-info">
                                <h3 class="project-title">${project.title}</h3>
                                <p class="project-description">${project.description}</p>
                                <div class="project-meta">${project.technologies.map(technology => `<span class="project-tech">${technology}</span>`).join(",")}
                                </div>
                            </div>
                        </a>
                    `
                    
                    projectContainer.appendChild(projectList)
                    console.log(project)
    })
    
    } catch(error) {
        console.log(error)
    }
}


themeToggleBtn.addEventListener('click', () => {
    if (rootEl.classList.contains('dark')) {
        rootEl.classList.remove('dark')
        rootEl.classList.add('light')
        localStorage.setItem('theme','light')
    }else {
        rootEl.classList.add('dark')
        rootEl.classList.remove('light')
        localStorage.setItem('theme','dark')
    }
})
