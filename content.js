(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const count = parseInt(localStorage.getItem("__scrollCount") || "20", 10);

  for (let i = 0; i < count; i++) {
    const showMoreBtn = document.querySelector('button[aria-label="Show more feed updates"]');
    if (showMoreBtn) {
      showMoreBtn.click();
      console.log("clicked load more " + i);
    } else {
      window.scrollBy(0, window.innerHeight);
      console.log("scrolled " + i);

    }
    await wait(2000);
  }

  await wait(3000); // Let feed settle/render

  const postElements = [...document.querySelectorAll('div.feed-shared-update-v2')];

const posts = postElements
  .filter(post => {
    const meta = post.querySelector('.update-components-actor__sub-description');
    return !(meta && meta.textContent.includes('Promoted'));
  })
  .map(post => {
    const postText = post.innerText.trim();
    const author = post.querySelector('.feed-shared-actor__name')?.innerText.trim() || "Unknown";
    const timestamp = post.querySelector('span.feed-shared-actor__sub-description')?.innerText.trim() || "";
    const link = post.querySelector('a[href*="/posts/"]')?.href || "";
    const hashtags = [...new Set((postText.match(/#[\w]+/g) || []).map(tag => tag.toLowerCase()))];
    return { author, timestamp, postText, hashtags, link };
  });

  const jsonOutput = JSON.stringify(posts, null, 2);
  const existingButton = document.getElementById('feed-scan-copy-btn');
  if (existingButton) existingButton.remove();
  const button = document.createElement('button');
  button.id = 'feed-scan-copy-btn';
  button.textContent = '📋 Copy Feed JSON';
  Object.assign(button.style, {
    position: 'fixed', top: '20px', left: '20px', zIndex: 9999,
    padding: '10px 14px', background: '#0a66c2', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '14px',
    cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    fontFamily: 'system-ui'
  });
  button.onclick = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      button.textContent = '✅ Copied!';
      setTimeout(() => button.textContent = '📋 Copy Feed JSON', 2000);
    });
  };
  document.body.appendChild(button);
})();