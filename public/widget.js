(function () {
  // Get the site ID from the script tag
  const scriptTag = document.currentScript;
  const siteId = scriptTag?.getAttribute('data-site');
  const slotId = scriptTag?.getAttribute('data-slot');
  
  if (!siteId && !slotId) {
    console.error('Kindling widget error: either data-site or data-slot attribute is required');
    return;
  }
  
  // Create a placeholder div for the ad
  const adContainer = document.createElement('div');
  adContainer.className = 'kindling-ad';
  adContainer.style = 'border:1px solid #f0f0f0; border-radius:4px; padding:12px; text-align:center; font:14px sans-serif; position:relative; overflow:hidden; min-height:90px; display:flex; align-items:center; justify-content:center;';
  
  // Show loading state
  const loadingElement = document.createElement('div');
  loadingElement.textContent = 'Loading sponsor...';
  loadingElement.style = 'color:#999; font-size:12px;';
  adContainer.appendChild(loadingElement);
  
  // Replace the script tag with our container
  scriptTag.replaceWith(adContainer);
  
  // Determine which API endpoint to use
  const apiEndpoint = slotId 
    ? `/api/widget?slot=${slotId}` 
    : `/api/widget/site?siteId=${siteId}`;
  
  // Fetch ad content from the API
  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response error');
      }
      return response.json();
    })
    .then(data => {
      // Clear the loading state
      adContainer.innerHTML = '';
      
      if (!data.hasActiveSponsors) {
        // Show placeholder if no active sponsors
        adContainer.textContent = 'Available ad space';
        adContainer.style.color = '#999';
        return;
      }
      
      // Get the sponsorship data
      const { sponsorship } = data;
      
      // Create the ad content
      if (sponsorship.creative && sponsorship.creative.startsWith('<')) {
        // HTML creative
        adContainer.innerHTML = sponsorship.creative;
      } else if (sponsorship.creative && (sponsorship.creative.startsWith('http://') || sponsorship.creative.startsWith('https://'))) {
        // URL creative - create an image or iframe
        if (sponsorship.creative.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const img = document.createElement('img');
          img.src = sponsorship.creative;
          img.alt = `Sponsored by ${sponsorship.sponsorName || 'a Kindling sponsor'}`;
          img.style = 'max-width:100%; height:auto;';
          adContainer.appendChild(img);
        } else {
          // Assume it's a landing page URL - create a text link
          const link = document.createElement('a');
          link.href = sponsorship.creative;
          link.textContent = sponsorship.sponsorName 
            ? `Sponsored by ${sponsorship.sponsorName}` 
            : 'Visit our sponsor';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style = 'color:#e05d37; text-decoration:none; font-weight:bold;';
          adContainer.appendChild(link);
        }
      } else {
        // Fallback text
        adContainer.textContent = sponsorship.sponsorName 
          ? `Sponsored by ${sponsorship.sponsorName}` 
          : 'Sponsored content';
      }
      
      // Add "Powered by Kindling" badge
      const badge = document.createElement('div');
      badge.innerHTML = '<a href="https://getkindling.com" target="_blank" rel="noopener" style="font-size:9px; color:#999; text-decoration:none; position:absolute; bottom:2px; right:4px;">Powered by Kindling</a>';
      adContainer.appendChild(badge);
    })
    .catch(error => {
      console.error('Kindling widget error:', error);
      adContainer.textContent = 'Ad space';
      adContainer.style.color = '#999';
    });
})();
  