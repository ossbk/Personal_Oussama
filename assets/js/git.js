const username = "ossbk";
const token = "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";

async function fetchProjects() {
  document.getElementById('loader').style.display = 'flex';
  try {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=100`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const projects = await response.json();
    await Promise.all(
      projects.map(async (project) => {
        project.languages = await fetchLanguages(project);
        project.thumbnail_url = await fetchThumbnail(project);
      })
    );
    displayProjects(projects);
  } catch (error) {
    console.error(error);
  }
}

async function fetchLanguages(project) {
  try {
    const response = await fetch(project.languages_url, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch languages for ${project.name}: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchThumbnail(project) { 
  const description = project.description;
  const regex = /!\[Project Thumbnail\]\((.*?)\)/;
  if (description) {
    const matches = description.match(regex);
    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      return null;
    }
  } else return null;
}

function displayProjects(projects) {
  const projectsList = document.getElementById("projects-list");

  projects.forEach((project) => {
    const listItem = document.createElement("div");
    listItem.classList.add("portfolio-wrap");
    listItem.classList.add("tech-box");
    const thumbnail = document.createElement("div");
    if (project.thumbnail_url == null) {
      project.thumbnail_url = "assets/img/no-img.jpg";
    }
    if (project.description) { 
        project.description = project.description.replace(
          /!\[Project Thumbnail\]\((.*?)\)/,
          ""
        );
      } else {
        project.description = "No description";
      }
    thumbnail.innerHTML = `<div class="portfolio-image">
        <img src="${project.thumbnail_url}" class="img-fluid" alt="" />
        <div class="portfolio-info">
          <a class="portfolio-title">${project.name}</a>
          <a href="${project.html_url}" class="portfolio-link"
          ><i class="fab fa-github"></i> GitHub</a
          ></div></div>
          <div class="portfolio-description">
          <p> ${project.description} </p>
              <div class="portfolio-tools">
              ${project.languages && Object.keys(project.languages).length > 0 ? '<strong>Made With:</strong><ul></ul>' : ''}
                <ul> 
                </ul>
              </div>
            </div>
        `;
        var toolsList = thumbnail.querySelector('.portfolio-tools ul'); 
        if (project.languages) {
            Object.keys(project.languages).forEach(function(language) {
                var listItem = document.createElement('li');
                listItem.textContent = language;
                toolsList.appendChild(listItem);
            });
        } 
    listItem.appendChild(thumbnail);
    projectsList.appendChild(listItem);
    document.getElementById('loader').style.display = 'none';
  });
}

fetchProjects();
