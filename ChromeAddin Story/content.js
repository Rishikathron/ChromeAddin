document.addEventListener('click', function(e) {
    let target = e.target;
    console.log("Anchor element:", target);
    console.log("Href attribute:", target.getAttribute('href'));
    while (target && target.tagName !== 'A') {
        target = target.parentElement;
    }   

    if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        console.log("inside the anchor tag ",href)        
        // Intercepting links that use the custom scheme
        if (href && href.startsWith('sample-bridge://')) {
            console.log("before send mesge")
            e.preventDefault();
            // Sending the URL to the background script for processing
            console.log("showing chrome.runtime",chrome.runtime)
            chrome.runtime.sendMessage({ action: "launchApp", url: href });
        }
    }
});
