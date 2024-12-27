async function fetchGitHubProfile() {
    const username = document.getElementById('username').value.trim();
    const profileContainer = document.getElementById('profile-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const rateLimitWarning = document.getElementById('rate-limit-warning');
  
    // Hide previous profile and rate limit warning
    profileContainer.innerHTML = '';
    rateLimitWarning.style.display = 'none';
  
    if (!username) {
      alert('Please enter a GitHub username');
      return;
    }
  
    // Show loading spinner
    loadingSpinner.style.display = 'block';
  
    try {
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      
      // Check if rate limit is exceeded
      if (profileResponse.status === 403) {
        rateLimitWarning.style.display = 'block';
        loadingSpinner.style.display = 'none';
        return;
      }
  
      if (!profileResponse.ok) {
        throw new Error('User not found or API error');
      }
  
      const profileData = await profileResponse.json();
      
      // Create the profile card
      const profileCard = `
        <div class="profile-card">
          <img src="${profileData.avatar_url}" alt="${profileData.name || profileData.login}">
          <h2>${profileData.name || profileData.login}</h2>
          <p><strong>Bio:</strong> ${profileData.bio || 'No bio available'}</p>
          <p><strong>Location:</strong> ${profileData.location || 'Not provided'}</p>
          <p><strong>Company:</strong> ${profileData.company || 'Not provided'}</p>
          <p><strong>Blog:</strong> <a href="${profileData.blog}" target="_blank">${profileData.blog || 'Not available'}</a></p>
          <p><strong>Public Repositories:</strong> ${profileData.public_repos}</p>
          <p><strong>Followers:</strong> ${profileData.followers}</p>
          <p><strong>Following:</strong> ${profileData.following}</p>
          <a href="${profileData.html_url}" target="_blank">View Profile on GitHub</a>
        </div>
      `;
      profileContainer.innerHTML = profileCard;
  
      // Fetch user repositories
      const reposResponse = await fetch(profileData.repos_url);
      const reposData = await reposResponse.json();
  
      // Display repositories if any
      if (reposData.length > 0) {
        const repoList = document.createElement('div');
        repoList.classList.add('repo-list');
        repoList.innerHTML = '<h3>Repositories</h3>';
  
        reposData.forEach(repo => {
          const repoItem = document.createElement('div');
          repoItem.classList.add('repo-item');
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a><br>
            <span>${repo.description || 'No description available'}</span>
          `;
          repoList.appendChild(repoItem);
        });
        profileContainer.appendChild(repoList);
      } else {
        const noReposMessage = document.createElement('p');
        noReposMessage.textContent = 'No public repositories available.';
        profileContainer.appendChild(noReposMessage);
      }
  
      loadingSpinner.style.display = 'none';
    } catch (error) {
      profileContainer.innerHTML = `<p class="error">Error: ${error.message}. Please try again later.</p>`;
      console.error('Error fetching profile:', error);
      loadingSpinner.style.display = 'none';
    }
  }
  