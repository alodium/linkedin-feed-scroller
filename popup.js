document.getElementById('scan').addEventListener('click', async () => {
  const scrollCount = parseInt(document.getElementById('scrollCount').value, 10) || 20;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (count) => {
      localStorage.setItem("__scrollCount", count);
    },
    args: [scrollCount]
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});