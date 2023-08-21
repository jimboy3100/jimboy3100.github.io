function resizeSpecificVideos() {
  // Resize videos inside elements with class 'skin-box' to 90x90 pixels
  var skinBoxVideos = document.querySelectorAll('.skin-box video');
  skinBoxVideos.forEach(function(video) {
    video.style.width = '90px';
    video.style.height = '90px';
  });

  // Resize videos inside '#skin-preview', '#next-profile', and '#prev-profile'
  var specificVideos = {
    'skin-preview': '180px',
    'next-profile': '80px',
    'prev-profile': '80px'
  };

  for (var id in specificVideos) {
    var video = document.querySelector('#' + id + ' video');
    if (video) {
      video.style.width = specificVideos[id];
      video.style.height = specificVideos[id];
    }
  }

  // Select the 'skins' container
  var skinsContainer = document.querySelector('#skins');
  if (skinsContainer) {
    // Iterate through profile numbers from 0 to 54
    for (var i = 0; i <= 54; i++) {
      // Select the anchor element with the specific href
      var anchor = skinsContainer.querySelector('.skin-box a[href="#profile-' + i + '"]');
      if (anchor && anchor.querySelector('video') && !anchor.querySelector('.scrolling-text')) {
        // Create a div to hold the scrolling text
        var scrollingText = document.createElement('div');
        scrollingText.className = 'scrolling-text'; // Add a class to prevent duplication
        scrollingText.style.position = 'absolute';
        scrollingText.style.top = '50%'; // Center vertically
        scrollingText.style.width = '100%';
        scrollingText.style.textAlign = 'center';
        scrollingText.style.fontSize = '8px';
        scrollingText.style.whiteSpace = 'nowrap';
        scrollingText.style.overflow = 'hidden';
        scrollingText.style.color = 'white'; // White font color
        scrollingText.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'; // Black outline

        // Create a marquee element for scrolling from right to left
        var marquee = document.createElement('marquee');
        marquee.direction = 'left';
        marquee.innerText = 'MP4, video skin';
        scrollingText.appendChild(marquee);

        // Append the scrolling text to the anchor element
        anchor.appendChild(scrollingText);
      }
    }
  }
}

function handleMutations(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length > 0) {
      resizeSpecificVideos();
    }
  });
}

var observer = new MutationObserver(handleMutations);

var targetNode = document.querySelector('#skin-preview');

if (targetNode) {
  var config = { attributes: false, childList: true, subtree: true };
  observer.observe(targetNode, config);
} else {
  console.log('Target node not found');
}

// Call the function to resize the videos when the page initially loads
resizeSpecificVideos();
