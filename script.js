async function fetchAnime() {
    try {
        const response = await fetch('http://localhost:3000/mal/anime');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch anime data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching anime data:", error);
        return null;
    }
}

async function fetchManga() {
    try {
        const response = await fetch('http://localhost:3000/mal/manga');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch manga data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching manga data:", error);
        return null;
    }
}

async function fetchLightNovel() {
    try {
        const response = await fetch('http://localhost:3000/mal/lightnovel');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch light novel data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching light novel data:", error);
        return null;
    }
}

async function fetchDramas() {
    try {
        const response = await fetch('http://localhost:3000/mdl/drama');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch drama data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching drama data:", error);
        return null;
    }
}

async function createImageContainers(containerId, data) {
    const container = document.getElementById(containerId);

    data.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('item');

        const imgLink = document.createElement('a');
        imgLink.href = item.link;
        imgLink.target = "_blank";

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;

        imgLink.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        const title = document.createElement('h3');
        title.textContent = item.title;

        const activity = document.createElement('p');
        activity.textContent = item.activity;

        switch (item.activity.toLowerCase()) {
            case 'watching':
            case 'reading':
                activity.style.backgroundColor = 'green';
                break;
            case 'completed':
                activity.style.backgroundColor = 'darkblue';
                break;
            case 'on-hold':
                activity.style.backgroundColor = '#cccc00';
                break;
            case 'dropped':
                activity.style.backgroundColor = 'red';
                break;
            case 'plan-to-watch':
            case 'plan-to-read':
                activity.style.backgroundColor = 'gray';
                break;
            case 'not-interested':
                activity.style.backgroundColor = 'purple';
                break;
            default:
                activity.style.backgroundColor = 'transparent';
                break;
        }

        const rating = document.createElement('p');
        const starRating = document.createElement('div');
        starRating.classList.add('star-rating');

        let filledStars = 0;
        switch (item.rating) {
            case 6:
                filledStars = 1;
                break;
            case 7:
                filledStars = 2;
                break;
            case 8:
                filledStars = 3;
                break;
            case 9:
                filledStars = 4;
                break;
            case 10:
                filledStars = 5;
                break;
            default:
                filledStars = 0;
                break;
        }

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            if (i < filledStars) {
                star.textContent = "★"; 
                star.style.color = "yellow";
            } else {
                star.textContent = "☆"; 
            }
            starRating.appendChild(star);
        }

        infoDiv.appendChild(title);
        infoDiv.appendChild(activity);
        infoDiv.appendChild(rating);
        infoDiv.appendChild(starRating);

        galleryItem.appendChild(imgLink);
        galleryItem.appendChild(infoDiv);

        container.appendChild(galleryItem);
    });
}


async function setupContainers() {
    await createImageContainers('animeGallery', await fetchAnime());
    await createImageContainers('mangaGallery', await fetchManga());
    await createImageContainers('lightnovelGallery', await fetchLightNovel());
    await createImageContainers('dramaGallery', await fetchDramas());
}

setupContainers();

function handleScroll() {
    const sections = document.querySelectorAll('section');
    const triggerBottom = window.innerHeight / 5 * 4;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

window.addEventListener('scroll', handleScroll);

handleScroll();

function scrollGallery(galleryId, direction) {
    const gallery = document.getElementById(galleryId);
    const scrollAmount = 200;
    const arrows = document.querySelectorAll('.arrow');
    
    arrows.forEach(arrow => {
        arrow.classList.remove('clicked');
    });
    
    if (direction === 'left') {
        gallery.scrollLeft -= scrollAmount;
        document.querySelector('.left-arrow').classList.add('clicked');
    } else if (direction === 'right') {
        gallery.scrollLeft += scrollAmount;
        document.querySelector('.right-arrow').classList.add('clicked');
    }
}