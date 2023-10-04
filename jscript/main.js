// Used to throttle the usage of another function.
// This is used for the "detectWhenToFadePortfolioGridItems" onscroll function
const throttle = (fn, delay) => {
  let time = Date.now();

  return () => {
    if ((time + delay - Date.now()) <= 0) {
      // Run the function we've passed to our throttler, 
      // and reset the time variable so we can check again if we can execute. 
      fn();
      time = Date.now();
    }
  }
}

// The portfolio grid items will fade from left and right when scrolled to first time.
const portfolioGridItems = document.querySelectorAll(".grid-item");
const portfolioSecondGridItem = document.querySelector(".grid-item.second");
const elementVisibleBuffer = 0;

// Detects when portfolio grid items should fade from left and right
function detectWhenToFadePortfolioGridItems() {

  if (portfolioSecondGridItem.classList.contains("active")) {
    // Remove event listener after initial scroll as this should
    // only occur once.
    window.removeEventListener("scroll", scrollFunction);
  }

  for (var i = 0; i < portfolioGridItems.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = portfolioGridItems[i].getBoundingClientRect().top;

    if (elementTop < windowHeight - elementVisibleBuffer) {
      // This triggers the animation
      portfolioGridItems[i].classList.add("active");
    }
  }
}

// Set the onscroll function but throttle it to be more performant
const scrollFunction = throttle(detectWhenToFadePortfolioGridItems, 50);
window.addEventListener("scroll", scrollFunction);


const navbar = document.getElementById("navbar");
const landingBackgroundImage = document.getElementById("landingBackgroundImage");
const navBarOffsetTop = navbar.offsetTop;
const dropdownMenu = document.getElementById('dropdown-content');
const dropdownMenuButton = document.getElementById('dropdown-button');

// Collapse nav bar dropdown menu if clicked occurs outside of it's boundaries
document.addEventListener('click', (event) => {
  const withinBoundariesOfMenu = event.composedPath().includes(dropdownMenu);
  const withinBoundariesOfMenuButton = event.composedPath().includes(dropdownMenuButton);

  if (!withinBoundariesOfMenu && !withinBoundariesOfMenuButton && dropdownMenu.classList.contains('menu-open')) {
    toggleDropDownMenu(dropdownMenuButton);
    dropdownMenuButton.classList.remove("navbar-link-hover");
  }
});

// The navbar should stick to top when scrolling.
// The scrolled percentage should also be calcualted.
function stickyNavBarAndScrollPercentage() {

  if (!document.body.classList.contains('modal-open')) {
    if (window.pageYOffset >= navBarOffsetTop) {
      navbar.classList.add("sticky");
      landingBackgroundImage.classList.add("sticky-margin");
    } else {
      navbar.classList.remove("sticky");
      landingBackgroundImage.classList.remove("sticky-margin");
    }

    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }

}

window.onscroll = function () {
  stickyNavBarAndScrollPercentage();
};

// Native smooth scrolling to an element isn't supported in all browsers.
// This function allows for smooth scrolling in all browsers.
// This is called by the logo, navbar items, dropdown menu items.
// If a keypress triggers it, the focus will go to the section title if available.
// This is for screen reader purposes as the title will be announced.
function smoothScroll(eID, event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {
    if (event && event.type === "keypress") {

      // Prevents the page from shifting down
      if (event.keyCode === 32) {
        event.preventDefault();
      }

      // Focus on section title if available.
      // Will announce section title to screen reader.
      setTimeout(() => {
        if (dropdownMenuButton.classList.contains("menu-open")) {
          toggleDropDownMenu(dropdownMenuButton);
        }
        let sectionTitle = document.getElementById(eID).querySelector(".section-title");
        if (sectionTitle){
          sectionTitle.focus();
        }
        
      }, 100);
    }

    // Determine how far to scroll.
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY); return;
    }
    // Want to scroll faster if distance is further
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;

    // Scroll
    if (stopY > startY) {
      for (var i = startY; i < stopY; i += step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
      } return;
    }
    for (var i = startY; i > stopY; i -= step) {
      setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
      leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
  }
}

// Gets the current y-axis coordinate
function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) return self.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

// Gets the y-axis coordinate of the specified element
function elmYPosition(eID) {
  var elm = document.getElementById(eID);
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent != document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }

  return y - 53;
}

// Function allows for arrow keys to be used to navigate throughout the navbar menu items.
// It will loop back to the first or last menu item if there's no subsequent menu item.
function navigateToMenuItem(event) {

  // Detect if left or right arrow key is pressed.
  if (event && event.type === "keydown" && event.keyCode !== 37 && event.keyCode !== 39) {
    return;
  } else {

    const navMenuItems = document.querySelectorAll(".horizontal-nav-item");
    let currentIndex = -1;

    for (var i = 0; i < navMenuItems.length; i++) {
      if (navMenuItems.item(i) === event.currentTarget) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex > -1) {
      // Loop back if no more menu items
      if (event.keyCode === 39) {
        if (currentIndex === navMenuItems.length - 1) {
          navMenuItems.item(0).focus();
        } else {
          navMenuItems.item(currentIndex + 1).focus();
        }
      }

      if (event.keyCode === 37) {
        if (currentIndex === 0) {
          navMenuItems.item(navMenuItems.length - 1).focus();
        } else {
          navMenuItems.item(currentIndex - 1).focus();
        }
      }

    }

  }
}

// Open or close the navbar dropdown menu
function toggleDropDownMenu(dropdownMenuButton, event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    // Prevents the page from shifting down
    if (event && event.type === "keypress" && event.keyCode === 32) {
      event.preventDefault();
    }

    const dropdownContent = document.getElementById('dropdown-content');
    dropdownMenuButton.classList.toggle("menu-open");
    dropdownContent.classList.toggle("menu-open");

    if (dropdownContent.classList.contains("menu-open")) {
      // Focus on first menu item
      dropdownContent.firstElementChild.focus();
      // Notify screen reader menu has opened
      dropdownMenuButton.ariaExpanded = "true";
      if (!dropdownMenuButton.classList.contains("navbar-link-hover")) {
        dropdownMenuButton.classList.add("navbar-link-hover");
      }
    } else {
      // Focus back on dropdown button if menu is closed
      dropdownMenuButton.focus();
      // Notify screen reader menu has closed
      dropdownMenuButton.ariaExpanded = "false";
    }
  }
}

// Loop back to the first item if there's no subsequent menu item
// and the Shift key is pressed.
function jumpBackToTopMenuItem(event) {

  if (event && event.type === "keydown" && event.keyCode !== 9) {
    return;
  } else {
    if (dropdownMenu && !event.shiftKey) {
      event.preventDefault();
      dropdownMenu.firstElementChild.focus();
    }
  }
}

// Dynamically update the aria label for the milestone markers and their related ellipsis.
const milestoneMarkers = document.querySelectorAll('.milestone-marker');

milestoneMarkers.forEach(milestoneMarker => {
  let milestoneTimePeriod = milestoneMarker.nextElementSibling.firstElementChild.innerHTML;
  milestoneTimePeriod = milestoneTimePeriod.replace("-", "to");
  let milestoneMarkerAriaLabelExpandable = "Milestone marker. Select to reveal or hide the full details about this timeline milestone from " + milestoneTimePeriod;
  milestoneMarker.setAttribute("aria-label", milestoneMarkerAriaLabelExpandable);

  let milestoneText = milestoneMarker.nextElementSibling;
  let milestoneEllipsis = milestoneText.querySelector(".milestone-ellipsis");
  if (milestoneEllipsis) {
    let milestoneEllipsisAriaLabel = "Select to reveal or hide the full details about this timeline milestone from " + milestoneTimePeriod;
    milestoneEllipsis.setAttribute("aria-label", milestoneEllipsisAriaLabel);
  }
});

// Allows for a milestone in the timeline to be expanded to reveal more details.
// This function is called when either the milestone marker or milestone ellipsis
// is selected
function toggleTimelineMilestone(milestoneMarker, event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    // Prevents the page from shifting down
    if (event && event.type === "keypress" && event.keyCode === 32) {
      event.preventDefault();
    }

    const milestoneText = milestoneMarker.nextElementSibling;
    const siblingCount = milestoneText.childElementCount;
    const milestoneBody = milestoneText.children[siblingCount - 2];
    const milestoneEllipsis = milestoneText.querySelector(".milestone-ellipsis");

    if (milestoneBody.classList.contains("hidden")) {
      // Toggle flags
      milestoneBody.classList.remove("hidden");
      milestoneMarker.classList.remove("unselected");
      milestoneMarker.classList.add("selected");
      // Update icon font
      milestoneEllipsis.innerHTML = "expand_less";
      // Notify screen reader
      milestoneMarker.ariaExpanded = "true";
      milestoneEllipsis.ariaExpanded = "true";

      if (event.currentTarget.classList.contains("milestone-marker")) {
        // Focus on full text to trigger announcment of text to screen reader
        setTimeout(milestoneText.focus(), 100);
      } else if (event.currentTarget.classList.contains("milestone-ellipsis")) {
        // Focus on previously hidden text to trigger announcment of text to screen reader
        setTimeout(milestoneBody.focus(), 100);
      }

    } else {
      // Toggle flags
      milestoneBody.classList.add("hidden");
      milestoneMarker.classList.remove("selected");
      milestoneMarker.classList.add("unselected");
      // Update icon font
      milestoneEllipsis.innerHTML = "more_horiz";
      // Notify screen reader
      milestoneMarker.ariaExpanded = "false";
      milestoneEllipsis.ariaExpanded = "false";
    }
  }
}

// Components related to photo gallery
const galleryImageThumbnails = document.querySelectorAll('.gallery-image');
const imageMasks = document.querySelectorAll('.image-mask');
const overlay = document.querySelector('.overlay');
const overlayCloseButton = document.getElementById('overlay-close-button');
const overlayNextButton = document.getElementById('overlay-next-button-div');
const overlayPrevButton = document.getElementById('overlay-prev-button-div');
const photoNumSpan = document.getElementById("photoNumber");
const photoDescription = document.getElementById("photoDescription");
const photoNumHiddenSpan = document.getElementById("hiddenPhotoNumber");
const overlayInner = document.getElementById('overlay-inner');
const slidingGalleryContainer = document.querySelector('.gallery-container');
const slideGallery = document.querySelector('.slides');
const slides = slideGallery.querySelectorAll('div');
const imageIndicators = document.querySelector('.image-indicators');
const slideCount = slides.length;
const slideWidth = 380;
var overlayImage = document.querySelector('.overlay__inner img.non-mobile');
var images = new Array();
var selectedImage, selectedImageNum;

// Highlight the image indicators of the current selected image in the mobile photo gallery
const highlightImageIndicator = () => {
  imageIndicators
    .querySelectorAll('div.highlighted')
    .forEach(el => el.classList.remove('highlighted'));
  const index = Math.floor(slideGallery.scrollLeft / slideWidth);
  imageIndicators
    .querySelector(`div[data-id="${index}"]`)
    .classList.add('highlighted');
  selectedImageNum = index + 1;
  // Update description and selected image
  photoNumSpan.innerHTML = selectedImageNum + "/" + images.length;
  photoNumHiddenSpan.innerHTML = "Displaying image " + selectedImageNum + " of " + images.length;
  selectedImage = images[index].offsetParent;
  photoDescription.innerHTML = selectedImage.lastElementChild.innerHTML;
};

// Scroll to the image related to the image indicator that was selected in the mobile photo gallery
const scrollToImage = el => {
  const index = parseInt(el.dataset.id, 10);
  const scrollInterval = Math.floor((slideGallery.scrollWidth - slideWidth) / (slideGallery.childElementCount - 1));
  slideGallery.scrollTo(index * scrollInterval, 0);
  // Update description and selected image
  selectedImageNum = parseInt(el.dataset.id) + 1;
  photoNumSpan.innerHTML = selectedImageNum + "/" + images.length;
  photoNumHiddenSpan.innerHTML = "Displaying image " + selectedImageNum + " of " + images.length;
  selectedImage = images[el.dataset.id].offsetParent;
  photoDescription.innerHTML = selectedImage.lastElementChild.innerHTML;
};

// Update the data id for each image only when on mobile device
if (window.mobileCheck()) {
    imageIndicators.innerHTML += [...slides]
    .map((slide, i) => `<div data-id="${i}"></div>`)
    .join('');

    imageIndicators.querySelectorAll('div').forEach(el => {
    el.addEventListener('click', () => scrollToImage(el));
  });

  slideGallery.addEventListener('scroll', e => highlightImageIndicator());
}

// Trap the keyboard focus within the modal so users can tab between the next, previous and close buttons.
// The next and previous buttons are conditionally displayed depending on which photo is currently displayed,
// so the next and/or previous focusable button can change.
function addTabKeyEventListenerToGalleryButton(event) {

  if (event && event.type === "keydown" && event.keyCode === 9) {
    if (event.shiftKey) {
      if (event.currentTarget === overlayCloseButton) {
        event.preventDefault();

        if (overlayNextButton.style.display === "none") {
          overlayPrevButton.focus();
        } else {
          overlayNextButton.focus();
        }
      }

      if (event.currentTarget === overlayPrevButton) {
        event.preventDefault();
        overlayCloseButton.focus();
      }

      if (event.currentTarget === overlayNextButton && overlayPrevButton.style.display === "none") {
        event.preventDefault();
        overlayCloseButton.focus();
      }

    } else {
      if (event.currentTarget === overlayNextButton) {
        event.preventDefault();
        overlayCloseButton.focus();
      }

      if (event.currentTarget === overlayPrevButton && overlayNextButton.style.display === "none") {
        event.preventDefault();
        overlayCloseButton.focus();
      }
    }
  }
}

// Open modal displaying photo when image thumbnail is selected.
function openGalleryModal(event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    // Prevents the page from shifting down
    if (event && event.type === "keypress" && event.keyCode === 32) {
      event.preventDefault();
    }

    overlay.classList.add('open');
    // Thumbnail images have _thumb appended to the image name.
    // The full sized image has the same name minus the _thumb.
    var src = event.currentTarget.querySelector('img').src;
    src = src.substring(0, src.indexOf("_thumb")) + ".webp";
    const altText = event.currentTarget.querySelector('img').alt;
    // Set the image src and alt text
    overlayImage.src = src;
    overlayImage.alt = altText;
    selectedImage = event.currentTarget;
    document.body.classList.add('modal-open');
    // Update the image description and image number for the selected image
    selectedImageNum = images.indexOf(selectedImage.firstElementChild) + 1;
    photoNumSpan.innerHTML = selectedImageNum + "/" + images.length;
    photoDescription.innerHTML = selectedImage.lastElementChild.innerHTML;
    photoNumHiddenSpan.innerHTML = "Displaying image " + selectedImageNum + " of " + images.length;
    // Focus on close button so keyboard users can easily exit.
    overlayCloseButton.focus();

    if (window.mobileCheck()) {
      // If on mobile, use a photo gallery that allows for scrolling between images using touch/scroll
      overlayPrevButton.setAttribute("style", "display: none");
      overlayNextButton.setAttribute("style", "display: none");
      overlayImage.setAttribute("style", "display: none");
      photoNumSpan.setAttribute("style", "display: none");
      const selectedPhotoIndex = selectedImageNum - 1;
      // Slide to the correct image that was selected
      const scrollInterval = Math.floor((slideGallery.scrollWidth - slideWidth) / (slideGallery.childElementCount - 1));
      slideGallery.scrollTo(selectedPhotoIndex * scrollInterval, 0);
    } else {
      // If not on mobile, use the default photo gallery.
      slidingGalleryContainer.setAttribute("style", "display: none");
      // Hide or display the next and previous buttons depending on which photo was selected
      if (selectedImageNum === 1) {
        overlayPrevButton.setAttribute("style", "display: none");
        overlayNextButton.setAttribute("style", "display: block");
      } else if (selectedImageNum === images.length) {
        overlayNextButton.setAttribute("style", "display: none");
        overlayPrevButton.setAttribute("style", "display: block");
      } else {
        overlayPrevButton.setAttribute("style", "display: block");
        overlayNextButton.setAttribute("style", "display: block");
      }
    }

  }
}

// Closes the gallery modal. If keyboard was used to close the modal, set the focus
// on the related thumbnail of the last selected image
function closeGalleryModal(event) {

  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    if (event && event.type === "keypress" && event.keyCode === 32) {
      event.preventDefault();
    }

    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (selectedImage) {
      selectedImage.focus();
      selectedImage = undefined;
    }
  }
}

// Add aria label, tabindex and role=button for each image thumbnail in the gallery.
// Add click and keypress event listeners so modal can be opened
galleryImageThumbnails.forEach((galleryImageThumbnail, index) => {
  // Populate array of image elements
  images.push(galleryImageThumbnail.firstElementChild)
  let imageNum = index + 1;
  let ariaLabel = "Gallery image " + imageNum + " of " + galleryImageThumbnails.length + ". Click image to expand."
  galleryImageThumbnail.setAttribute("aria-label", ariaLabel);
  galleryImageThumbnail.setAttribute("tabindex", "0");
  galleryImageThumbnail.setAttribute("role", "button");
  galleryImageThumbnail.addEventListener('click', openGalleryModal);
  galleryImageThumbnail.addEventListener('keypress', openGalleryModal);
});

// Set presentation role for accessibility purposes.
// Image masks are slightly opaque that clear when hovered over
imageMasks.forEach(imageMask => {
  imageMask.setAttribute("role", "presentation");
});

// Add appropriate event listeners to gallery components
overlayCloseButton.addEventListener('click', closeGalleryModal);

if (!window.mobileCheck()) {
  overlayCloseButton.addEventListener('keypress', closeGalleryModal);
  overlayCloseButton.addEventListener('keydown', addTabKeyEventListenerToGalleryButton);
  overlayPrevButton.addEventListener('keydown', addTabKeyEventListenerToGalleryButton);
  overlayNextButton.addEventListener('keydown', addTabKeyEventListenerToGalleryButton);
  overlayNextButton.addEventListener('click', nextPhoto);
  overlayPrevButton.addEventListener('click', prevPhoto);
  overlayNextButton.addEventListener('keypress', nextPhoto);
  overlayPrevButton.addEventListener('keypress', prevPhoto);
}

// If gallery modal is open and ESC is pressed, close the modal.
// If dropdown navigationb menu is open and ESC is pressed, close the menu.
document.addEventListener("keyup", function (event) {

  if (event && event.type === "keyup" && event.keyCode !== 27) {
    return;
  } else {

    if (overlay && overlay.classList.contains("open") && document.body.classList.contains('modal-open')) {
      closeGalleryModal();
    } else if (dropdownMenu && dropdownMenuButton && dropdownMenu.classList.contains('menu-open')) {
      toggleDropDownMenu(dropdownMenuButton);
      // Return focus to the menu button
      dropdownMenuButton.focus();
    }
  }
});

// Allow for navigation between photos by using the left/right arrow keys when gallery modal is open.
// Allow for navigation between dropdown menu items when up/down arrow keys are pressed.
document.addEventListener("keydown", function (event) {

  if (event && event.type === "keydown" && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
    return;
  } else {

    if (overlay && overlay.classList.contains("open") && document.body.classList.contains('modal-open')) {

      event.preventDefault();

      if (event.keyCode === 39) {
        nextPhoto();
      } else if (event.keyCode === 37) {
        prevPhoto();
      }
    } else if (dropdownMenu && dropdownMenuButton && dropdownMenu.classList.contains('menu-open') && dropdownMenu.contains(document.activeElement)) {

      event.preventDefault();

      // If down key pressed, go to next menu item.
      // If no subsequent menu item, return focus to first one
      if (event.keyCode === 40) {
        if (document.activeElement.nextElementSibling) {
          document.activeElement.nextElementSibling.focus();
        } else {
          dropdownMenu.firstElementChild.focus();
        }
      } else if (event.keyCode === 38) {
        // If up key pressed, go to previous menu item.
        // If no subsequent menu item, return focus to last one
        if (document.activeElement.previousElementSibling) {
          document.activeElement.previousElementSibling.focus();
        } else {
          dropdownMenu.lastElementChild.focus();
        }
      }
    }
  }
});

// Ensure gallery buttons are not shown on mobile.
window.addEventListener('load', event => {

  if (window.mobileCheck()) {
    overlayNextButton.style.display = "none";
    overlayPrevButton.style.display = "none";

    // Mobile specific styling required for these elements
    photoNumSpan.classList.add("mobile");
    photoDescription.classList.add("mobile");
    overlayInner.classList.add("mobile");
  }

})

// Displays next photo in modal
function nextPhoto(event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    if (images.includes(selectedImage.firstElementChild)) {
      let index = images.indexOf(selectedImage.firstElementChild);
      if (index < images.length - 1) {
        let newImage = images[index + 1];
        // Remove fade animation class initially.
        // Will be re-applied at end of function to re-trigger animation.
        overlayImage.classList.toggle("fade-in");
        // Thumbnail images have _thumb appended to the image name.
        // The full sized image has the same name minus the _thumb.
        // Set the image src and alt text
        var src = newImage.src;
        overlayImage.src = src.substring(0, src.indexOf("_thumb")) + ".webp";
        overlayImage.alt = newImage.alt;
        selectedImage = newImage.offsetParent;
        selectedImageNum++;
        // Update the image description and image number for the selected image
        photoNumSpan.innerHTML = selectedImageNum + "/" + images.length;
        photoNumHiddenSpan.innerHTML = "Displaying image " + selectedImageNum + " of " + images.length;
        photoDescription.innerHTML = selectedImage.lastElementChild.innerHTML;

        // If last photo in gallery, hide the next photo button.
        // Also move focus to previous button for keyboard users
        if (selectedImageNum === images.length) {
          overlayNextButton.setAttribute("style", "display: none");
          overlayPrevButton.focus();
        }

        // If not last photo in gallery, continue to display the next photo button.
        if (selectedImageNum > 1 && !window.mobileCheck()) {
          overlayPrevButton.setAttribute("style", "display: block");
        }
        // Trigger fade animation when navigating between photos
        overlayImage.classList.toggle("fade-in");
      }
    }
  }
}

// Displays next photo in modal
function prevPhoto(event) {

  // No event passed when click was the trigger.
  // Only proceed if the key pressed was Enter or Space
  if (event && event.type === "keypress" && event.keyCode !== 13 && event.keyCode !== 32) {
    return;
  } else {

    if (images.includes(selectedImage.firstElementChild)) {
      let index = images.indexOf(selectedImage.firstElementChild);
      if (index > 0) {
        let newImage = images[index - 1];
        // Remove fade animation class initially.
        // Will be re-applied at end of function to re-trigger animation.
        overlayImage.classList.toggle("fade-in");
        // Thumbnail images have _thumb appended to the image name.
        // The full sized image has the same name minus the _thumb.
        // Set the image src and alt text
        var src = newImage.src;
        overlayImage.src = src.substring(0, src.indexOf("_thumb")) + ".webp";
        overlayImage.alt = newImage.alt;
        selectedImage = newImage.offsetParent;
        selectedImageNum--;
        // Update the image description and image number for the selected image
        photoNumSpan.innerHTML = selectedImageNum + "/" + images.length;
        photoNumHiddenSpan.innerHTML = "Displaying image " + selectedImageNum + " of " + images.length;
        photoDescription.innerHTML = selectedImage.lastElementChild.innerHTML;

        // If first photo in gallery, hide the previous photo button.
        // Also move focus to next button for keyboard users
        if (selectedImageNum === 1) {
          overlayPrevButton.setAttribute("style", "display: none");
          overlayNextButton.focus();
        }

        // If not first photo in gallery, continue to display the next photo button.
        if (selectedImageNum < images.length && !window.mobileCheck()) {
          overlayNextButton.setAttribute("style", "display: block");
        }
        // Trigger fade animation when navigating between photos
        overlayImage.classList.toggle("fade-in");
      }
    }
  }
}

// if (navigator.userAgent.match(/Trident\/7\./)) {
//   document.addEventListener("mousewheel", function (event) {
//     event.preventDefault();
//     var wd = event.wheelDelta;
//     var csp = window.pageYOffset;
//     window.scrollTo(0, csp - wd);
//   });
// }

// Determine the current operating system
function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'MacOS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

   return os;
}

// Determine the current browser
function getBrowser() {

  if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
    return 'Opera';
  } else if (navigator.userAgent.indexOf("Edg") != -1) {
    return 'Edge';
  } else if (navigator.userAgent.indexOf("Chrome") != -1) {
    return 'Chrome';
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    return 'Safari';
  } else if (navigator.userAgent.indexOf("Firefox") != -1) {
    return 'Firefox';
  }

  return '';
}

// Add event listeners to change link images on interaction 
const linkedinImg = document.getElementById('linkedin-img');
const linkedinA = document.getElementById('linkedin-icon-anchor');
const emailImg = document.getElementById('email-img');
const emailA = document.getElementById('email-icon-anchor');
const githubImg = document.getElementById('github-img');
const githubA = document.getElementById('github-icon-anchor');
const linksContainer = document.querySelector('.links-icon-container');

// Add event listeners to link icons so the changes when the icon is navigated to or away from.
// If divElement is present, also add to parent div. This is for issue where Firefox and Safari
// on MacOS does not tab to anchor tags
function addEventListenersToLinkIcon(anchorElement, imageElement, imageSrc, isActionedEvent, divElement) {

  if (isActionedEvent) {

    if (divElement) {
      divElement.addEventListener('focus', function () {
        imageElement.src = imageSrc;
      }, false);
  
      divElement.addEventListener('mouseover', function () {
        imageElement.src = imageSrc;
      }, false);
  
      divElement.addEventListener('touchstart', function () {
        imageElement.src = imageSrc;
      }, false);
    } else {

      anchorElement.addEventListener('focus', function () {
        imageElement.src = imageSrc;
      }, false);

      imageElement.addEventListener('mouseover', function () {
        imageElement.src = imageSrc;
      }, false);

      imageElement.addEventListener('touchstart', function () {
        imageElement.src = imageSrc;
      }, false);
  }

  } else {

    if (divElement) {

      divElement.addEventListener('focusout', function () {
        imageElement.src = imageSrc;
      }, false);
  
      divElement.addEventListener('mouseout', function () {
        imageElement.src = imageSrc;
      }, false);
  
      divElement.addEventListener('touchend', function () {
        imageElement.src = imageSrc;
      }, false);

    } else {
      anchorElement.addEventListener('focusout', function () {
        imageElement.src = imageSrc;
      }, false);

      imageElement.addEventListener('mouseout', function () {
        imageElement.src = imageSrc;
      }, false);

      imageElement.addEventListener('touchend', function () {
        imageElement.src = imageSrc;
      }, false);
    }
  }
}

addEventListenersToLinkIcon(linkedinA, linkedinImg,
  "data:image/png;base64,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",
  true);

addEventListenersToLinkIcon(linkedinA, linkedinImg,
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAALpklEQVR4Xu2ddcx0RxWHn2LFoTgJbqEEK94Wh+IOwaVI8BAKlOLaFBosSAkEK67B3SkuKW5Fg1tx9zz57pbty767o1f2zkm+fH+8I+ec+e3cmWOzF41mrYG9Zi19E54GgJmDoAGgAWDmGpi5+G0HaACYuQZmLn7bARoAZq6BmYvfdoAGgJlrYObitx2gAWAWGhDo5wDODpwZOCNwSuAUnfR/B/4K/AY4Hvh59+8/266dbdwBXOQDgP2ASwL7AucF9o5cTAHxfeDrwJeAY4FPAr+MHGfUzbcBAKcFrg1cH7gWcMHKGj8O+ADwru7/P1eer+rwUwWA2/dNgdsC1+u286qK2mVwF/+dwGuAtwF+SiZFUwPAhYH7AXcCzjQyTftpeBnwXOC7I+NtV3amAoD9gcOAGwMnGbly/wW8CTgS+NzIeR19PMBlgcO7bX7sulzF31uBR3eHyFHyP9Yd4JzAk7utfqw8hi7ov4EXAY8CfhHaqa92Y1Ou/PiNPwI4XV9K6Gme3wGHAi8ERmNfGBMALtAdog7saUGGmuZDwMHAD4ZiYHnesQDgLsCzt/BXv9sa/xa4T3d9HBQHQwNA69xRwN0H1cJwkyv7IcA/hmJhSABom38LcIWhhB/JvB8Hbgb8agh+hgLAxToLmjb6RvAd4AaAZuZeaQgAXB54D7BPr5KOfzItiQcBX+yT1b4BoJdOJ8rp+xRyQnPpjta38Zm+eO4TAP7y398Wf+PSCoJr9LUT9AUAv/kfa9v+xsVfNPBzoD3kW8E9Ehv2AQBP+5/qgjIS2Zxlt28DOsGq3g5qA8B7/jHtqpcMYHfNa9a0E9QGgHbvuRp5kld9R0ctpA8oNdjOcWoCQPPu0bUYn9m4twFeV0PmWgAwLu/zM7Lt11ib5TH1HRjg+sPSE9UAgGN+tDvFluJXwX8GGABqWNjJSg08oXE+2AW9FmW5BgD05z+nAJf/7OLrnsUeU+mCjBO4HfA4wMCROZHnqReXFLg0AFyQbxbY+n8P3AT4yBphTfB4O3ClkgoZ+VgaiS5S8mpYGgAe+jz85dLNgTcHDCIIvtJl/QQ034omz+tiCYoIUxIAl+miYHPH1D165QjpvCI9M6L91JsadXzpDvjZsuQu1jIDJkiYnZNLDwWeEjGILmVTuOZEhp3fooTApQDgd9i8uRJ0R+CVEQN5IxgsoiaCz9JN3XG9amdRKQD4vTZVqwQ9MHJL9+D5kxITT2yM13apcVlslwCA9/JvFMzYMVhEn3go3a2Luw9tvy3tPAtcKPfzVwIAzwD81Zakq3VOpE1jnhr4MmBI+RzJ9LOH5QieCwC9fW6/pRM1tfqZ6v21NcKdqrOP3yhHARPvayGLc+ecgXIBoJPC1Oga9CfgCcDzAbNqFmRyqAGUot9Ak7mTEcVGVydRLgDeCGi0qUnm3Hva/WlnYfQOrAGo0R4NvBq4faoycgCgY8bQJYs1NBpOA38EztrVOIrmIgcAbj0aJBoNrwENcO9OYSMHANqk75UyaetTXAOawpNuYjkAMGixdkGm4poqNKDp3Z5JDNjUCulnUINU6dtQKLtfBS4e2ni5XSoALMXmVa0GWVZlnRt41Zw6hE6+hhljCkLNxRpXVlk1vXK9vHNBy6O3lJ0kCKxYpkfUa2xfJCA9GOsujqJUANT8/j8NeEiUFOBB6DRr+hhEYpsQ2imblcC8jrrNWjswlPRoWhlE/30f5NXYrKsoSgXA44HHRM0U3nhMALBIpNdcg1xSyBQ47+hXT+kc2eeRXWWVqG6pACjp/NnJ8FgA8AnghoABmTnkdfnTPRitkpxDqQDwF1FraxsDACzoZH7eH3JWfqnv5bqEz1R9h7BhOdtLhTRcbpPCkH3+klB7N5S3oQHgYhmF7KGvJNXcNeVTsEZnXacAoLb/fWgAlFz05bEscmndwJrkTeDXMROkAEBbfHYkyhomtxUAei89TyxK1MesU2hbnWMeXIMpBQDeb83zr0XbCgD1ZeEH6yTUoqt2STnB46cA4JbAG4JniG84NgD4i71Kl96uW1ojVWrKtsWkLXRdizRgRX1mUgBwB+AVtSQAxgQAU7NfCpxrSd6/AUYua12MpSflRvBsmPDWwOtjmEoBwF1LpyftYHgsADDq1hyF3dzdXhM/HKNs4OEpxpqIOdxdon6cDQC7a1f36nXXKN9IKHMUY0gTd0zOQ8zYtu0FAHP4BHif9jp10jUrYMKqjqMYqg2AXj4BczgEaru3qPM60km0zgG1qm9tAJhQ69M1wZTyCfBg5KNJtWgMZ4CQ6iamr69zQQ8BAG8r1hUKphQAaG/+QvAM8Q3HAACja8x3WEcmZsQWqqi9A/RiCLLsm9EwtWgMAAhZqDECwIikqKCQlB3APn7/akUDNwCk/bQ0UvkiahSlAMAJtDdfNGqm8MYNAOG6Wm5pkWn9NFGUCoCaCSENAFFLeELjFLtE8rNxFmh6bBqfG3s1AGxU0coGjwA0NUdR6g7gfTM5H20Dhw0AUUt4QuOk5JBUAJiKVOsNvAaAeAD4NqE3gOUk2qBRUgHg4LXiAhsAgpbuRI2skWAl0WjKAYCPJPv0WWlqAIjXqEarB8V3I/kQ6Fy1YtwaAOJX8jrA++K75QHA8iymh/t/SWoAiNOmVVXPBhioEk05nwAnM/rkVtGzru/QABCnUPMV7xzX5X+tcwFQwzXcABC3mtZIekdcl3IAMGDyx8BZUhlY0a8BIFyZFug6D6BjKolydwAnfSrw4KTZV3dqAAhX5hGASaHJVAIA1ujzeTOrd5WgBoAwLVrvQN3/KKz56lYlAODI5gl4HihBxycUn9h3AwD1XmotCyVTrIx72ERW5oih0HFDxrSesnWVs6gUAEyo/GwWJ61zjAasCGJklhbALCoFAJnQOaSTqFF9DfiCmEU6s6kkALRFmzRa6iyQLdyWDmAw6iW6At3ZIpYEgMy8ALhHNldtgHUaKPqQZGkAaJI8DjhDW8MqGjAp1cosUYGf6zgpDQDnumdX4LmKBmY+aHTq1yZ91QCAY/rIYR+VsTbJt01/j31II0j2GgBwYh9yMkq1fQqClmFjI20jHrKLP41TCwBKZObsqzaK1hqEaCD0HcWQsU7UpiYAnOgo4L7RXLUOyxrQ13JoLZXUBoDJkxZROKCWAFs+rhnKB+V4+zbppzYAnN8IYt8UnGtl8U1rsNvffYnNH06xK9+qifoAgPN6dzVtWTA02qwBK7G7+N/b3DSvRV8AkMv9uuthdAJjnoiT6+2J32fzYj2NSYL2CQAZvGL3tEkDwerlcvGN8D02aTUTOvUNAFk0g/W97XPwf6vltu9jE7388hezDwEA5/a5WR83aAfDPSvhgc8HH6p/83fCbigAyIeBpFbQPjBh59qmLl71jKaqetrfTWFDAkCetBM8Hbj/Nq1ohCwaeXz7NzmqN2KulU2HBsCCKaNbfIZuLodDD3vGTbgDDkpjAYBKML79JYBl6LaZ9Or55H1xx06K0sYEgAX/KsetcZ8UgUbcx2COQ2Jr+daWZ4wAWBwQD++2yXXlWmvrp8T4xvCZSm9ZnUEOeuuEGCsAFjz7GuYTAd/ymxoZum3yrLWUvOaNksYOgIXSLN1+WHddGvuO4C/eJ9yOLBG3Xxs1UwHAQg/nA+4NHAz4fO2YyEPd0d1txlfHJkFTA8BCqdoPtJx5fbRSiY8zDkEWZzAhxl+87wsMdp9PFX6qAFiW15K1BqBaJs0HrSyYXEsu8wu11ftolqbsY1Irc6QuWOl+tRRVms+Y8bw+7t85nQykNHH0/IAPSMeQv25t8yaW+iqnWU8GtkSXYouZtO+22wiA3XRoHT3PDfogBMneS6+fWl/Hl8G9pi2yk0d3ZasBjjkBoIb+Jj9mA8DklzBPgAaAPP1NvncDwOSXME+ABoA8/U2+dwPA5JcwT4AGgDz9Tb53A8DklzBPgAaAPP1NvncDwOSXME+ABoA8/U2+dwPA5JcwT4D/AlabGp/L/OKhAAAAAElFTkSuQmCC", 
  false);

addEventListenersToLinkIcon(emailA, emailImg,
  "data:image/png;base64,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",
  true);

addEventListenersToLinkIcon(emailA, emailImg,
  "data:image/png;base64,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", 
  false);

addEventListenersToLinkIcon(githubA, githubImg,
  "data:image/png;base64,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",
  true);

addEventListenersToLinkIcon(githubA, githubImg,
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKU0lEQVR4nO2dfZRVVRXAf+MwUpAWooamVKAh1lSrssZVFCYmJZLZKslKzYC+o7IkNRWLlpi2amy1yDIqzJIwP0izLMISP2JVfi0VGbWUzEYCEqmpgLmtTXtWr9e7zL3vnnPuufec31r7j3nzPvbd59xz9zln730gEolEIpFIJBKpEQcA04DZwEJgCXAtsBr4DdAHPKTSp6+t1vfIez8HvBc4Ur8r4jFP14aShv4FsBFIDMtG/W7pGK8Hnlb2RYdMB9ADnAOsAgYsNHgyjAxohzgbeJXqFLHMgcB8YF0JDZ4MI48Ai4CDYi8wy2hgDnAzMOhBQyfDiOj4K/U9RsXO0D57APOAxz1o1KRN2QAsAJ4VO0J29lajbfKgARNDsgXoBcbFjpCOeNXnAls9aLDEkjwFfAYYGTvC/yLTqvs9aKDEkci6w/TYCWB/YKkHDZKUJD8CxofaEU7WITEJXLYA7yawVbteDwyfeCZLdcpbaw4B7vbA2L7K/UA3NeWdwN88MLLvshV4BzVDFnR2eGDcqsggcDo1oEPXx8s2aFWlF9iNitIJXOqBEevgHHZRMbo0sKJs49VFrgFGUKFhf4kHRqubfLcqMQcXemCsusoFeM7pHhip7nIaHs/zqxCwUXUZBGbhGS+Mizy4XiyajEdr+3d5cGeEJvf4EnL2LQ+MEap8o+zGP8nwBf0aWAM8APzDAwMnhmSz3rG3WIhoFt+rFA4wvJ9/VdM8VxY+DgVOBa6sWOzAemAx8GYNZW9EAkQfNvhbT2pgjXOWG/ZsJ2aIEp4L3OdBAycpcgPwpgzr9yca/t0rcMzRhi/gtpx7DBJB81jG7/6n7rNfq4tUp2lHmgXMVJmlr8n/LgJWAGuBf2X8jVuBw3NcwyiNBDJpQ8mDdBa922dY+c+2oceeKQ6oTJF+rBlEPQXX0LuA12gk78oWfon8/ZE2d+yuNmzDta6ijc8xrHiizmS7zFb/4DodWm1OjcYAHwRuBx7VnECflszPwkHSho24fQkLL0IZO2UjCn7+wxbsKI+VvbDIQgtKi0wlPN5vyZaSVWWFZ+p8NnYAvzvAJvWPjHOWJYVFjiM8Pm3RnuIAG0UcqycsKixTsND4ikV79pt2hudYVLbdaWDVucayTaW+kTFutqysrCqGxoOWbXqTKUUnOAj0kOXdkBjtIE9C2ux5JpRdYFnRIWXHEg5vcGDTRFcwC9HhYKgaEtk5C4XzHdl0XdFI4h5Hiia6CRMKtzu062FFFD3boaI3EgYjHMdPnllE2VUOFT2KcFjo0K4/K7LtO+Aw6yUkRur2rQvbDrRb1vZIRwpKSNOzCY/pDkeBqT4PU5ICHSp3ObLxeb4+/2X+/wLCZY6jDvDzdpSzUXK9WX5C2IyyuMXeKLKRl4sDHfVM2RMPnSsc2TpXmdppjpSSqmGhM9dHR3C2A4X+ZM+mleIwRx3gFN9mABK6HWFnEKd3M4FvOlDo27H1d9KRIwHFWSLpCgcKeV/uxCEuEmElESUzq33fpKjZCLDNgb3lGBuvVqhCjANMyzZKHMgd5MDF4Q0X51GoxhzkqAPkCrt7yIFCEhUbYWd+YaJ+wCZdtWs8zfR3DSecDsnv9b15Hh3yucz0pawnX6K1fyVQ5OO6iPE2zYl/HfDyXcg0lZn6maL5gJH/bi2P0eDdbo3imt+i/aRNC/kAIWbvVJW3tGi/O/N8wW0ZU7glvHlf7X0va7rjj2i463v0tUP0vftpr93d3DVXlrdrjYH5emraIt0iv2QX8qWGkVg+9yFtn2Mb6hm0KmKRmZUtvuAPGsWy3uCZfiEFgrZCAmG2+xga5mIhKNEiC5UogGyJDziyc6IlcjLz9TZjz/q0FNoKLd9ykWbBztWh7nh9JEzRR8IkrfkTKntrQIzY4pVqm6PVST5ZHW05rv6rwPeBn+qZSxvaaJ+vFU0F36aJBtfrM0hKpcwAXgLsY89GkRQk0PP5+sw/UUv3XKb+299btN8Z5OBdLb5ACh0Wmarspw7gZO3xh2uPf2OAYWEd6qkf0+AoDznPLwKeW7DIwz0t2k86SWampAzxnU0VtCbqe6Va5SeBLwPL1Im8U5/xWWoKSfrZMwiHj2YctrfrcL9Oq6hep8fwnKfRVMfq7KvxdPLOlHD+V+dR8DkpCl2q+/jrLGxhit8RApNThuiiskGH/ytT/i8jcC76LSg5nMijp86MKamy+uPtKHt9CYrKkHcC9WS0g0IbRqaALusCpJV2rVuq+J5asSMpSWSGkJsZJSo8qEudnTV55t9boi0TTUPLzViHy5RpsrId58Wjqd6plhy+PLJNfY+2uKVk5ROdRi6q2DTxFRqClXggvyxyIWd6cAFDsl5Ln7WV6uyIbuByz05Pk6X4tnmpAQVM1xjYpOFkYmxfDs06RbdbEw/lxUWfY48W+HHZL0DjAC62EP16h4aXH6UN4YoJuhJ3tYWDH0yKbOGXWtFKGmh8w3d1a4ybjYsd0JT2Xm2cqQY2qTp1n+KtGnyxzGHVNBMiGV6FmVRQiX59lDSmRC9zaIQtGkS5RkPRe3RRppnRGtd4gW6m9Dso5mhTBjXi2AhFZwOPNZ2e1eEo/WzIEEtyGmOixjP45MxZTQRxkS28sin6p0tP2bJphCcKHqY0XWsYJRWU92CQUW1GoTSLnPbViMztf2vJAA9rwERRuoFHPGjQPPJnG06xiaKRD+qd38g4wwcpJtpZjRRKbngk/MWDhs0quaJ/sjLG0JSn1dHn4w1uk263dIbeEY7SuIvKk3q8jxUuNOQLpJ0MmhbMkGcqOM/WxQOf8qCBhxNZNrfGvgacIvGsDx7mTlueIfdANln+qKnsi3XjpTE0ylad37s9aOQ02ewiQNfEXSAjyXDspokTE5pkr5L3A6Z4PD38hAsD7G7gCPTNKYsxVeEGDxq7lYPt5OhYNMGjqMLvo7pM96DBm0UihJ1SNH2sz2WPNUyHoyIaWeWqMowwzsDc+ItUl4UeNPzQamdp1dZPMHAB51Y0QfS1HjR+onmEpbLM0NqAZLhUiS5LJ6nnke/hScizqdMv1mg4+vFaQnVSi2lgs+xf4rXfW2Lj36eLZ14gDfXXKiU9GOLGkq5ZluQPxTOOK2mBRIIwy+LyEq53RxlTvqy0qk1jWyQnviwuq1qUrwukKkjsAIRbXLND08jjCIBRG3ynStNl2TX7YXwEYKrxl1cxT7LT0UhQdx9gqd5QlUSGrC/EDkC7jd9bpWF/V5xhcYpYxxFgh8Zd1IpjLJ2RV7cOsEUriNWSg1NKmMUOwE4brNWCErVmD93EiB2A/ztBvUo1EAozQ88ODH0E6Nfk0yDZR+e4oXaAH8Qyu/9BNjceCKgDrNURMNIUYPGxNs4ikJyAslicU9eNWia2OT0u0lSd7Pwc8QVy2kZZzMuoo0x/P685DZEcs4V5mv2TZtitJZeqHws8NYyDt8BBxlKtGamHJ9zUtJo42CLdvAxOaqHXKn29qmHv3jJB76hbPYuKmak6LTBUkyASiUQikUgkEolEIpFIBNP8G5S29DarSiN4AAAAAElFTkSuQmCC", 
  false);

// This is for issue where Firefox and Safari on MacOS does not tab to anchor tags
// This checks for OS and browser, then adds a tabindex to parent div.
// An onkeypress event listener is then added so when ENTER is pressed the child achor
// href is navigated to.
function addTabIndexAndEventListenerToIconDiv() {

  const browser = getBrowser();
  const os = getOS();

  if (os === "MacOS" && (browser === "Safari" || browser === "Firefox")) {

    for (var i = 0; i < linksContainer.children.length; i++) {
      linksContainer.children[i].setAttribute("tabindex", "0");
    }

    addEventListenersToLinkIcon(linkedinA, linkedinImg,
      "data:image/png;base64,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",
      true, linksContainer.children[0]);
    
    addEventListenersToLinkIcon(linkedinA, linkedinImg,
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAALpklEQVR4Xu2ddcx0RxWHn2LFoTgJbqEEK94Wh+IOwaVI8BAKlOLaFBosSAkEK67B3SkuKW5Fg1tx9zz57pbty767o1f2zkm+fH+8I+ec+e3cmWOzF41mrYG9Zi19E54GgJmDoAGgAWDmGpi5+G0HaACYuQZmLn7bARoAZq6BmYvfdoAGgJlrYObitx2gAWAWGhDo5wDODpwZOCNwSuAUnfR/B/4K/AY4Hvh59+8/266dbdwBXOQDgP2ASwL7AucF9o5cTAHxfeDrwJeAY4FPAr+MHGfUzbcBAKcFrg1cH7gWcMHKGj8O+ADwru7/P1eer+rwUwWA2/dNgdsC1+u286qK2mVwF/+dwGuAtwF+SiZFUwPAhYH7AXcCzjQyTftpeBnwXOC7I+NtV3amAoD9gcOAGwMnGbly/wW8CTgS+NzIeR19PMBlgcO7bX7sulzF31uBR3eHyFHyP9Yd4JzAk7utfqw8hi7ov4EXAY8CfhHaqa92Y1Ou/PiNPwI4XV9K6Gme3wGHAi8ERmNfGBMALtAdog7saUGGmuZDwMHAD4ZiYHnesQDgLsCzt/BXv9sa/xa4T3d9HBQHQwNA69xRwN0H1cJwkyv7IcA/hmJhSABom38LcIWhhB/JvB8Hbgb8agh+hgLAxToLmjb6RvAd4AaAZuZeaQgAXB54D7BPr5KOfzItiQcBX+yT1b4BoJdOJ8rp+xRyQnPpjta38Zm+eO4TAP7y398Wf+PSCoJr9LUT9AUAv/kfa9v+xsVfNPBzoD3kW8E9Ehv2AQBP+5/qgjIS2Zxlt28DOsGq3g5qA8B7/jHtqpcMYHfNa9a0E9QGgHbvuRp5kld9R0ctpA8oNdjOcWoCQPPu0bUYn9m4twFeV0PmWgAwLu/zM7Lt11ib5TH1HRjg+sPSE9UAgGN+tDvFluJXwX8GGABqWNjJSg08oXE+2AW9FmW5BgD05z+nAJf/7OLrnsUeU+mCjBO4HfA4wMCROZHnqReXFLg0AFyQbxbY+n8P3AT4yBphTfB4O3ClkgoZ+VgaiS5S8mpYGgAe+jz85dLNgTcHDCIIvtJl/QQ034omz+tiCYoIUxIAl+miYHPH1D165QjpvCI9M6L91JsadXzpDvjZsuQu1jIDJkiYnZNLDwWeEjGILmVTuOZEhp3fooTApQDgd9i8uRJ0R+CVEQN5IxgsoiaCz9JN3XG9amdRKQD4vTZVqwQ9MHJL9+D5kxITT2yM13apcVlslwCA9/JvFMzYMVhEn3go3a2Luw9tvy3tPAtcKPfzVwIAzwD81Zakq3VOpE1jnhr4MmBI+RzJ9LOH5QieCwC9fW6/pRM1tfqZ6v21NcKdqrOP3yhHARPvayGLc+ecgXIBoJPC1Oga9CfgCcDzAbNqFmRyqAGUot9Ak7mTEcVGVydRLgDeCGi0qUnm3Hva/WlnYfQOrAGo0R4NvBq4faoycgCgY8bQJYs1NBpOA38EztrVOIrmIgcAbj0aJBoNrwENcO9OYSMHANqk75UyaetTXAOawpNuYjkAMGixdkGm4poqNKDp3Z5JDNjUCulnUINU6dtQKLtfBS4e2ni5XSoALMXmVa0GWVZlnRt41Zw6hE6+hhljCkLNxRpXVlk1vXK9vHNBy6O3lJ0kCKxYpkfUa2xfJCA9GOsujqJUANT8/j8NeEiUFOBB6DRr+hhEYpsQ2imblcC8jrrNWjswlPRoWhlE/30f5NXYrKsoSgXA44HHRM0U3nhMALBIpNdcg1xSyBQ47+hXT+kc2eeRXWWVqG6pACjp/NnJ8FgA8AnghoABmTnkdfnTPRitkpxDqQDwF1FraxsDACzoZH7eH3JWfqnv5bqEz1R9h7BhOdtLhTRcbpPCkH3+klB7N5S3oQHgYhmF7KGvJNXcNeVTsEZnXacAoLb/fWgAlFz05bEscmndwJrkTeDXMROkAEBbfHYkyhomtxUAei89TyxK1MesU2hbnWMeXIMpBQDeb83zr0XbCgD1ZeEH6yTUoqt2STnB46cA4JbAG4JniG84NgD4i71Kl96uW1ojVWrKtsWkLXRdizRgRX1mUgBwB+AVtSQAxgQAU7NfCpxrSd6/AUYua12MpSflRvBsmPDWwOtjmEoBwF1LpyftYHgsADDq1hyF3dzdXhM/HKNs4OEpxpqIOdxdon6cDQC7a1f36nXXKN9IKHMUY0gTd0zOQ8zYtu0FAHP4BHif9jp10jUrYMKqjqMYqg2AXj4BczgEaru3qPM60km0zgG1qm9tAJhQ69M1wZTyCfBg5KNJtWgMZ4CQ6iamr69zQQ8BAG8r1hUKphQAaG/+QvAM8Q3HAACja8x3WEcmZsQWqqi9A/RiCLLsm9EwtWgMAAhZqDECwIikqKCQlB3APn7/akUDNwCk/bQ0UvkiahSlAMAJtDdfNGqm8MYNAOG6Wm5pkWn9NFGUCoCaCSENAFFLeELjFLtE8rNxFmh6bBqfG3s1AGxU0coGjwA0NUdR6g7gfTM5H20Dhw0AUUt4QuOk5JBUAJiKVOsNvAaAeAD4NqE3gOUk2qBRUgHg4LXiAhsAgpbuRI2skWAl0WjKAYCPJPv0WWlqAIjXqEarB8V3I/kQ6Fy1YtwaAOJX8jrA++K75QHA8iymh/t/SWoAiNOmVVXPBhioEk05nwAnM/rkVtGzru/QABCnUPMV7xzX5X+tcwFQwzXcABC3mtZIekdcl3IAMGDyx8BZUhlY0a8BIFyZFug6D6BjKolydwAnfSrw4KTZV3dqAAhX5hGASaHJVAIA1ujzeTOrd5WgBoAwLVrvQN3/KKz56lYlAODI5gl4HihBxycUn9h3AwD1XmotCyVTrIx72ERW5oih0HFDxrSesnWVs6gUAEyo/GwWJ61zjAasCGJklhbALCoFAJnQOaSTqFF9DfiCmEU6s6kkALRFmzRa6iyQLdyWDmAw6iW6At3ZIpYEgMy8ALhHNldtgHUaKPqQZGkAaJI8DjhDW8MqGjAp1cosUYGf6zgpDQDnumdX4LmKBmY+aHTq1yZ91QCAY/rIYR+VsTbJt01/j31II0j2GgBwYh9yMkq1fQqClmFjI20jHrKLP41TCwBKZObsqzaK1hqEaCD0HcWQsU7UpiYAnOgo4L7RXLUOyxrQ13JoLZXUBoDJkxZROKCWAFs+rhnKB+V4+zbppzYAnN8IYt8UnGtl8U1rsNvffYnNH06xK9+qifoAgPN6dzVtWTA02qwBK7G7+N/b3DSvRV8AkMv9uuthdAJjnoiT6+2J32fzYj2NSYL2CQAZvGL3tEkDwerlcvGN8D02aTUTOvUNAFk0g/W97XPwf6vltu9jE7388hezDwEA5/a5WR83aAfDPSvhgc8HH6p/83fCbigAyIeBpFbQPjBh59qmLl71jKaqetrfTWFDAkCetBM8Hbj/Nq1ohCwaeXz7NzmqN2KulU2HBsCCKaNbfIZuLodDD3vGTbgDDkpjAYBKML79JYBl6LaZ9Or55H1xx06K0sYEgAX/KsetcZ8UgUbcx2COQ2Jr+daWZ4wAWBwQD++2yXXlWmvrp8T4xvCZSm9ZnUEOeuuEGCsAFjz7GuYTAd/ymxoZum3yrLWUvOaNksYOgIXSLN1+WHddGvuO4C/eJ9yOLBG3Xxs1UwHAQg/nA+4NHAz4fO2YyEPd0d1txlfHJkFTA8BCqdoPtJx5fbRSiY8zDkEWZzAhxl+87wsMdp9PFX6qAFiW15K1BqBaJs0HrSyYXEsu8wu11ftolqbsY1Irc6QuWOl+tRRVms+Y8bw+7t85nQykNHH0/IAPSMeQv25t8yaW+iqnWU8GtkSXYouZtO+22wiA3XRoHT3PDfogBMneS6+fWl/Hl8G9pi2yk0d3ZasBjjkBoIb+Jj9mA8DklzBPgAaAPP1NvncDwOSXME+ABoA8/U2+dwPA5JcwT4AGgDz9Tb53A8DklzBPgAaAPP1NvncDwOSXME+ABoA8/U2+dwPA5JcwT4D/AlabGp/L/OKhAAAAAElFTkSuQmCC", 
      false, linksContainer.children[0]);
    linksContainer.children[0].setAttribute("onkeypress", "actionIconLink(event, 'linkedin-icon-anchor')");
    
    addEventListenersToLinkIcon(emailA, emailImg,
      "data:image/png;base64,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",
      true, linksContainer.children[1]);
    
    addEventListenersToLinkIcon(emailA, emailImg,
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAJ30lEQVR4Xu2cZexsPRHGfy8Owd15IVhwh6DBAgT7gLu7Q3B3f5FgwYJDcAgaJARP8OAkuDsEd/Ij3WRzOP+9uzvdbe/tzKd7/3umnc7ztKedmZ6jSBnaA0cNPfocPEmAwUmQBEgCDO6BwYefK0ASYHAPDD78XAGSAIN7YPDh5wqQBBjcA4MPP1eAJMDgHhh8+LkCJAEG98Dgw88VIAkwuAcGH36uAEmAwT0w+PBzBUgCDO6BwYefK0ASYHAPDD78XAGSAIN7YPDh5wqQBBjcA4MPP1eAJMDgHhh8+LkCJAEG98Dgw88VIAlQzQO3A54PnLBai9nQnAd+D9weeGsN99ReAS4IvBk4dw3jso3/88AXgRsC367lm9oE0K6TAC8FblzLyGznfx54CXBv4K81/VGDAOcDvjZj1D2AY4Dj1TR4wLb+DNwVePXM2C8JfCbikxoE+GMx8DUHGPhG4OiIkQPrfqMs+V+d8cE9gWcCx4/4pwYB/lMMOGiJOgXwSuC6EUMH1H09cGfACbYs01dsCMOQcrFqQQD/+wXgRjObFPt5IPBE4DgDgrnJkP8G3Bd40YzS3CY7hGFIeYYA/mnVMeUKwBuAM27ikYGe/W6ZQJ+bGfNBx+wQhiHlAwiwsP3ZwIOAf0wGcxrgdcDVBgJ2naG+A7gt8LvJw8ZVjK9IgDkJYRhSPgQB/PnT5Tj4w4nlxwIeBTwS8N8jyz+BhwLPmHGC8ZQ3ARda4aAQhiHlNQjgI78GbgW8d2YQVwdeC7gqjCg/Bm4KfHxm8O6lXlbiKqt8E8IwpLwmAXzMjeKTy6z/12Q0Zyr7gssPxoAPAjcHfjkZt3ETV4N7remPEIYh5Q0IsBjLR4CbAT+bDM6TwZPKSWHNcR+2j/0beDzwOMB/L8tZy5J/qQ1GF8IwpLwFAVQRfEkgGaZyvRIzOPkGDjicHnW23wL4wIzR1wZeBZxywwGFMAwpb0kA1XwNPLrM+uU4gr+dHTB6eIkNHdH7458AbgL43l+WYwNPAB4MW327OYRhSDlAgIUD3Bi6QXSjuCyGN80j3L13VNe0z5DtQwB3/Mty+rL/udKa7cw9FsIwpFyBADbhEdHMoUfGqbhDNsR84oCDWqp6pvf8/vYZI64MGO49XdDAEIYh5UoEsBmDRS6Bz5pxxnlKjcEFgo7at/rnS1TvO5OO9fnDgMcCLv9RCWEYUq5IgIUTrHKx2sVw8rKcCHgBcJuot/akbxzfeL5x/WU5VUnrXquiHSEMQ8o7IIBNWu1i1YvVL1ORHM/ruOzsT8BdSnBravtlyub2LBXBt6kQhiHlHRHAZq16uQ/w4hlnGRa17OxclR0Zbe7rhbhzxTGuBk8DjhvtZEY/hGFIeYcEWIzTIhOrYZxZy2JO3DCp4dIe5CA7Twq8HLjBDo0MYRhS3gMB7MIZJdBzM8twqWHTVmVnvuOt05tbqS5Sonrn3CH4R+wrYOozVwBXgrmyM8OmBo7OtmNHT5t3d+9exSKYqdwJeC5wgj3YFJrEIeU9rQDLPnSmOeOmu2vLzgyjXmcPDreLt5Xz/dxp5YXArfdkxzArwLI/V5WdWYBi2VmN8/UchkbyjFcYpZzKecvm9Px7BH9IAjjoVWVnVywRttplZz8qsfxPzgBscsvVqUXEMrSKh5QbvAKmvj+o7Oy0pezsqpVm4/uBWwK/mrRnzsLo5d0q9bNNMyEMQ8odEEATLCszmzYVS83MOD4iUHZmvt6Qre1Pc/f2598fvg1qFXVCGIaUOyCANQXXAP6+wqH+7unh1Bs6/Rcld2/lzkHiLv9DwGU3bLvm4yEMQ8qNCeBtGcvIlqtorSxypk5n65lL2vVya3reGj1z9z+ZPO/mUp8tp3WN77svaHUhNoRhSLkhAX4KGFv/wRJARgcNEUsCa+1+PgHPvz8FeMAKElicYmDJbN1BuXvv6hmYWo5OngP4FODeY98SwjCk3IgAfwDc6S8ni84AvAcw+qZIEGsJPjqDxvWBVwDTsrPflrr8d87oTHP3XtywhGuZZF7U9JVk5nKfEsIwpNyAAM5Kgz3uyhfi7WQriyyoXBbLztwAPrVUJS//ZtmZq8XFyh8/W2b19yZtrMrde4vHtO43l3S0zeKPXcUh5ogVwjCk3IAAdyjJlYUjXAl0uJHAg+RdpY7gN5MHFkc4/3y/LXP3tmkhq/V+CzFkbTRwXxLCMKS8ZwJYRu2xbiGWkRn+Xed69PfLDF/3Lv2lS35huqrMgWrq2hjBW5Z+9A6ENYD7kBCGIeU9EsB39vLdODdyT9+wGMKjonoWlKwScw1uBDfJ3XvquD/wnNKwfvXo6WZ01xLCMKS8JwJYQ++Gy7pBgzvG4S0W2VbMHN4RcDO5LOburTEww7etGBWUZJ4mTFG/D3ADuUsJYRhS3gMBvgR4pVywDLo4q2oUV3yrAP3lMoaaVUZe5rTU3Yzlycq9v10WtIYwDCnvmAAmXzzre5HC2zIez9YN5Kwz4/4C+B0jfVC7zvBjgMdNj5bWABoj8A7kLiSEYUh5hwQw22eU7yvl+0IupZaHH05ijaDHRDegFwYkhcGq2hLCMKS8IwK4WdNxHwYuDry7wuWJ2k5ftz0DUu5frGHwKrxj2WRzuU4/IQxDyjsigO9P3/WSwA1bixz7Oo5f9xk/8uTG0uCV9xo80dSUEIYh5R0QwMidFT0GfLxccaR8UMoIpvcFrBA2fW1Mo5aEMAwpVyaAdwD9LJr5dz8fcySKY3tMue/oUbSGhDAMKVckgIkcj3de/zroY0g1nNVDG64Cnj4sLL1mBYNCGIaUKxHAzJpJFN+NFm+MIJ5qJLqbwkVCattxhzAMKVcggOfkq5R340W39cBhquftYV8DVhStSmYdanghDEPKFQhgE1b0HKmfhDkUeE6ACPi2H8IwpFyJAIdyUv6+2gMhDEPKSYAuuBnCMKScBEgC6IHpV7668MpARoQmcUg5V4AuaBbCMKScBEgC5CugPQdCkziknCtAe/QzDtAFBk2NCE3ikHKuAE2BX3QewjCknARIAuQmsD0HQpM4pJwrQHv0cxPYBQZNjQhN4pByrgBNge9mE9iFF9KI7TxQYwXYrufU6sIDSYAuYGhnRBKgne+76DkJ0AUM7YxIArTzfRc9JwG6gKGdEUmAdr7vouckQBcwtDMiCdDO9130nAToAoZ2RiQB2vm+i56TAF3A0M6IJEA733fRcxKgCxjaGZEEaOf7LnpOAnQBQzsjkgDtfN9Fz0mALmBoZ0QSoJ3vu+g5CdAFDO2MSAK0830XPScBuoChnRFJgHa+76LnJEAXMLQzIgnQzvdd9JwE6AKGdkYkAdr5vouekwBdwNDOiCRAO9930XMSoAsY2hmRBGjn+y56/i99mnKQG6IuYQAAAABJRU5ErkJggg==", 
      false, linksContainer.children[1]);
    linksContainer.children[1].setAttribute("onkeypress", "actionIconLink(event, 'email-icon-anchor')");
    
    addEventListenersToLinkIcon(githubA, githubImg,
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAQB0lEQVR4nO1dCbRVVRn+3kNkcMopQJ+iaOWAZuKsIQlqDoljy5zQUCyLNEcSHCCnFDRWaqGmJkkImqAp6sOUQcMWqSDmQ8TETAIU8IFoPni39a/13bXuuu5/n33O2efec88931p7LYZ79tnT2fsfvv/fQI4cOXLkyJEjR44cGUITgAEAzgdwA4D7AUwFMBvAXACLACxmWcR/m83fyG9/CWAwgP6sK0eK0YUTJRP9VwAfAyh4Lh+zbnnHEXxnjiqhAcBBAK4F8AKAzxOY8EJA+YwL4hq2RdqUI2HsAOAqbtmFlJUlAG4BsGu+CvxiEwBDeD63p2CiCwFF2jgLwAVse46I+AqAEQBWxJiMdQBeB/AIgJu4e1wI4CwAJ1FIHMA/n8X/u4q/ncRn18V4/3IAwwFska8Cd2zLCfgk5GCLHPAigOsAHAWgp6dzuRHATqxT6p4RQeZYTeFxm3wh6BCpeiSAT0MM7AIObP8KS+VduXPcCODNEO1dS8G1cwXbWhMQteqtEOrYOACHIT3YkwLgfx378A6AY6vd6LRI9X92HLRnARwHYCOkFx0BHA/gOcc+PVrPRqbzuCUGSdSPA9gftYcDAExx0FzWABiEOoKoRg85TPyfAPRG7WMvaiFBC+GBelAbdwfwRsBAtFDAyhq+7dD3t7hgMomzA3TqVgCXpfyM9yEjXMFtXxsH0YLORMYwLGALnAZge9QPmijU2o5AWSg1DzHE3GrpaBuA62lsqTc0ALgYwBeW8Rlby2MjW/nvLZ37d8p0+WrhQAD/sozTeB4dNQVp8F8snWoGsHW1G5kiiIn4ect4PVFLi0C2tgctnRHDT24K/TI2BjDRMm4P18pxMMbSibtqpRNV/Hhut4zfb5By/MLSeLGV53DDVZZxvBwpxTkWVU9oUznC4TqLingGUoY9LW7cu6vduBrGr5UxFR/KHkgJxH79T6WhEx3P/N0AvEr//hwaSe6hZbAvBaRaZDQNJKtpAoDppJ63UKrf1KGODgAmK2O7gLyEqkNz7Ex3nLgdAXxgOfOK5tHHSd1K82LYEsBFAF4CsD6gT886qnadyD421SHxC1V36Zoa9r6jnt9AWrdtoEx1X8yBCYuOpIqJU6pPCSewD7fUnhH17R7croPc2+VFznlXmpz2kYjsVRXsqHRYzLuHOtZxfMgBKy2LA1g13QGcSrVqGqnkbQ71fsHfPg1gNIATLVy+DpTKW2PEFnzVcaz6Ku1vrRapRGPyiOPHFVNiLICiRHwX+YCNdLnKl/h2zHoLhvcsIAdwb7a9JwmicesWlc8Vw5U6hMFcURyrNGRaCENPo+IWXQrgSQpLG0Jw7D70POmFAL/9asffigv8HwAeU/ojMQQIMWYa3exoVAhdOOCmrWj7kHxAU0cuKfmN8Om/Ryk6Dj+/0mUpj55DyoTWSQrJFSHHzfThvB1RLgqNkUqnRWULg75KPdoi2pwRQks8TJAM4LKS6OBlASQN1yLRS8dQNjBhoPJc2MCRK6tlcNtWMfjMj8DkOcVQj9Cqg9DZgVVTLAsB3AvgJwzs2NkyOeD/9eJ2OpRq1rsO71nEyQ1Cd+X5sEadjko8wpqkvaw3KQKSCF9hcbKhrnkhnt+NC6/0+Ta6oYV+th38oaclPvER7k6uMEnyUax6hyum91FI0LJlEnyEvRsFpu3wtQhWyCdIthzKHSpp7ArgZgAf0coXFqawsm9EbItJpliVVCziCOXr7x0jGqi8Pjnfw6Ja7uWNIgrQpiMgqh6/t7ILiFfWKzZRonTFPBsVvRXDSJaxq6HPG2IyoacqUcle/QRDlJW7f8wjxVRnltnB3zX0V0y8cSOQTOMouZG8YbbizIgLk/FGIn2ziisV41lcNBvqFSulF+yinDMSqBkXzxjqzQQfXsHEhJhSJp9KO9Xe2LjeUPkyTyzVawx1y5mWRTTQQljeXx9h4hspoenX+Gi0yex7B/ygn2IazSJxtLehr20hbQg2jFUMVLGypBysCBj7emp0F0UvzmKA5FBDP//msf79lLkSITEyrjVUKG5RnwyaTzz4FWoB0wz9nOn5HSbzsLiQI8PE1pGcPEhw25LyfWQPv1X66uJDiGOqF2qe1+3Zl5q2uxIYKREwWURXeh5N57QvnuORhvrXRY3E6m+o7HOP2bhMjKKVALohuzhK2QWESOprkZk+2u9EqewGQ0WSh88HdlBYsz9C9jHB0G9xZvnCDF8eQtP5L0JhUqSS/9RSBGzMIBqTYc2VSBsloiiSHGBKuS5bWFw0crKTWly1gOkJcvyPVpxDodCknFVCjIiLbxrqXU+2TL3gNMMYfOgpte1OytxJ7IIzBhgq+NSThe5nhrr/jvrCtsox8HUPdTcqBFqxujrjfEMFkjk7Ken/V6g/tBjGQXYGHyinyhUYxRVLAxDuW1IdF29WvWGiYRzEXewDk+NqAqbkTmJl8oGVhrr3Qf3hHsM4SCiaD9xsqFvY0c54IiE/fUfl7AsloGQ49n+sp7qHxaXvmRhAP/bQsG0UCTUVce4Vxm2GcZBF4QMXxXU8zTNUIFeqxMVmygLYCvWHuxN0tJ0Tl3JvurxBwqR9qChtCdkXag3jY0YK23CioW7J4uKMxQl6Ad831F2PGUNnGsbBV/Inkx1H5jTWAhA37Z0A/sjwq5dIQCgGWK6ghF8sH5f836vMj/Oikkzhh6g/LDWMw2wyfJs5XnNJyVuslLdpRHuOavo4kkzHxV0Arvf3+CpClqgnNFV4fEMfAa8rlaznl76Q2byameVjUlm5n6vwYf69md7FucruIiu5nnCeYQzWcWzeLNktm2nUKR3bqSW7RDPdv/MZYGK7ce21uGqgXKroA9sptoAsEkE1PJlgGtjOCgF1Ztx4M18SKrjCkzKCpB3bK2QYH652W8pe8cHEMgXbYgG6MF7/MObyu5BBCWN5FExkA2TLepmh1eX1t4bImFXLuN2yRTczO9kk5l8cR/OwWPYGk0B6KL2GnUNaGe+N6wx6jDb7HzBbljTylRCXJbqU1GfDjomdPV91v5RzMJlzciZjNkweV2FhOWOwx0au5CIpFXBmKV7B9RGzjdQCGpWMn//jeMyl8F1U8VZ6yltULOfGZQSb4gPnUP8Uu/ZPmfalL1OedAvIx9OkSK1LMnrJ8nBlHOV+BRs6UXDei6SOU0iqGc1deA7nImi++oUVVEyVjGBuGl+JiEyBpwUaN8RvkBWco2g+y5knwQe2ogym3dkQmnJnEtROgF90ttgcZmXESTTIkqJWUtn6xkAfpFAo55XPsLDSCCHNgNHiiSdXrTN/pOUSDSGEJIEbfdHCTZqA2JyTwEmW9Opr6d/2wZitFHpxB9PO4xkeI6xcKOejfGXxak0wX/8FAbeLvuQxeCIpbM4Px2aSfT2pNG4UGNfGFQCL6MKsXeWVycJICucG3KQp5SlazdK0I/RgRM7ygLbPSjiTpxYcGjmHsEkOEJXPNYfdTbxD8Faqli6T1l+JSjLJByOqeHfOpqRxT6YuH9TeCRW4L3GMz/BwLYePGHNcDEmmM32+I/mjR8i7BFpIsTqLkTFJoCtV4OE017pmL/+ogrd8mYxrV8ep8CClUzYad7eAL0LO+d85fg1nKAkqg8pqmkgf4CIeQhX2YBpUerFsycUmf/5ayTUyYlL9Ob+op2iZc727oNx8XqmQt30TyOWoJomyHQMnOA7OHMeEzpsxYMLF2pWW8jQvha62k0l4G4mEG39gMfMeGGKg3ufdQ65b8CWWK+qqXdbxnI+VlCkiOihJN6Mks/4Seinq2UDLrmEiPGjlTW7FYSOMhfv2XpUnvY0u3EFVNl2b7l5o9ykPmYwaQvHSILaCP4QYyJkRVZUGagEXUNtYlPCEryef4Wbm/XW5/LESmJFkqlhwgE0DIl+iDbeGGNwJHnT7bp6ulClYFoDcYZQmfEtpq2hiXtPFL1cmLcge/nSIAb4rwIVsQyd6EbW6l9BOfmrJhZEDyspRdGs/ZrFKrk0Zf9EUZbwsiXA7kz97g8Ng9AwwjZaXKREyhck77lPq20BhKKwR5gDLkTKvUjd0BWAfRT0Nc3ejM7ZQroxxiTq9I4JE/Qh920PKylASVEeRfj7P8rV+RgEpKroryRYSuZUjAkzC9kqP+YedPITtvB8vSlq4dzxz5MqLXB4VFzsqpulVEbQXnzhc6bOQbBLDNoq36TWHa09MVPMVzA4S9tJllyKmYSQYbFnwlOs/ap6FNxRvbeIkGlMC6QJ5ajYcozx3MlW5Vz1O/ocJqGjPKANejdwGlyn9jmX3d0VnRThaHWDVa1See6HEdjDMwaXqUryqQCXp2NsTypsQllpuCrBtqaRgarr8qDiZjSEzV5TnHtiYt2jcyDsJnymLhSvGIo6jSbq8rndjqJJBeL6CLCkTOliYRqLGVhSPKg253PJMV8W791EE50mjUpcX+7eFsFL+vvVJSt0OuX8KtAVUHE1K4MLnAZN5tcWuPoZEEhf0MdSxIeFr5zZTtBZh4iSNQxQ3e9hb271ikDKZH1j84J0U4kK5JasYK6eVBTHvHo4K0xYsHtMk0UPx9lVDBvkSHlAaNstCIN1dyRcYt1QiwvgWzzeoBmFjEmJN/RXrZ9WxiXJXTYEJIhotZkxTvqCKxb9FxNmG98oEJYFGCsKmvs5PU3q9PS32flvuu625iqPQrUxFtJNq3PqxMKF33an0cw130VThTItN/lqHS5Vv8+DPF109aeznK/QqAKOUPsoYn46U4grL5LiGlW1HnfZ0gyOotJg0ENEMkkYfw3tFHU1aziiWS5FyjLY0fozHgI4VGVwADZar9GomrX4D3bRaJyZ5iovL2gLoxByM2riNT1k0VKC3ypRxvFhe9pAPKEsLoDtp8tp4TXHwtqZyETwUQNGSQI16XwCHBqjDD9bi5BfRECDQtJHA0FiHC6ABwMUBwbBjs3KT+uUBod/PReCw1/IC2FmJ4y+W9lqQ9sPijADmz1pG/nTI8ALoQDKHjSS7Js16flzsoThxSstcx4QGtbYAjnBgPc1nws1Mo2uAmlgsUwPMnbWyAPZwDJW7L8G0MalNnWaiNpWWDbQb9KnBBbAfk0cE+Tla0+DSrRaaOMFBX0dRUDyp5ILpNC6Ajmxjs2OfJlaTzJEmHM07A1zz496i7B7VWgCtbJPpFhBTaakGhy/t6MRsHnHy41ZrARQcSytD7JLKtJYJbE1X6KoIAzyDyRmP85yapTvrHKmEYgeVlTR4ZSHzacWwOePv4sQJrGKuoPH0Ul5KRs9pJHIOYDmS/3Y2fzOaz7wScSGWchuHVZA1nFm18XwmkbBZE9NS2rlLDE4TZSsr2IGRwQtTMNGFsvIeBcFdqj1I9YIDKFBND5Gzz2dZx3dfHTcVWw4/8Yr9KDxOj5hbsBBQlrPukXxXGhJE5AiQ3Pvxjr6RNLU+TlliLnXxxSxv8d9m8jf38ZlzGYdfqWSPOXLkyJEjR44cOXIgcfwfcyV7LxAEZgwAAAAASUVORK5CYII=",
      true, linksContainer.children[2]);
    
    addEventListenersToLinkIcon(githubA, githubImg,
      "data:image/png;base64,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", 
      false, linksContainer.children[2]);
    linksContainer.children[2].setAttribute("onkeypress", "actionIconLink(event, 'github-icon-anchor')");

  }
}

// When ENTER is pressed the element is clicked
function actionIconLink(event, anchorElmID) {

  if (event && event.type === "keypress" && event.keyCode !== 13) {
    return;
  } else {

    const anchorElm = document.getElementById(anchorElmID);
    anchorElm.click();
  }
}

window.addEventListener('load', addTabIndexAndEventListenerToIconDiv);

/*linkedinA.addEventListener('focus', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

linkedinImg.addEventListener('mouseover', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

linkedinA.addEventListener('focusout', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

linkedinImg.addEventListener('mouseout', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

linkedinImg.addEventListener('touchend', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

linkedinImg.addEventListener('touchstart', function () {
  linkedinImg.src = "data:image/png;base64,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";
}, false);

emailA.addEventListener('focus', function () {
  emailImg.src = "data:image/png;base64,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";
}, false);

emailImg.addEventListener('mouseover', function () {
  emailImg.src = "data:image/png;base64,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";
}, false);

emailA.addEventListener('focusout', function () {
  emailImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAJ30lEQVR4Xu2cZexsPRHGfy8Owd15IVhwh6DBAgT7gLu7Q3B3f5FgwYJDcAgaJARP8OAkuDsEd/Ij3WRzOP+9uzvdbe/tzKd7/3umnc7ztKedmZ6jSBnaA0cNPfocPEmAwUmQBEgCDO6BwYefK0ASYHAPDD78XAGSAIN7YPDh5wqQBBjcA4MPP1eAJMDgHhh8+LkCJAEG98Dgw88VIAkwuAcGH36uAEmAwT0w+PBzBUgCDO6BwYefK0ASYHAPDD78XAGSAIN7YPDh5wqQBBjcA4MPP1eAJMDgHhh8+LkCJAEG98Dgw88VIAlQzQO3A54PnLBai9nQnAd+D9weeGsN99ReAS4IvBk4dw3jso3/88AXgRsC367lm9oE0K6TAC8FblzLyGznfx54CXBv4K81/VGDAOcDvjZj1D2AY4Dj1TR4wLb+DNwVePXM2C8JfCbikxoE+GMx8DUHGPhG4OiIkQPrfqMs+V+d8cE9gWcCx4/4pwYB/lMMOGiJOgXwSuC6EUMH1H09cGfACbYs01dsCMOQcrFqQQD/+wXgRjObFPt5IPBE4DgDgrnJkP8G3Bd40YzS3CY7hGFIeYYA/mnVMeUKwBuAM27ikYGe/W6ZQJ+bGfNBx+wQhiHlAwiwsP3ZwIOAf0wGcxrgdcDVBgJ2naG+A7gt8LvJw8ZVjK9IgDkJYRhSPgQB/PnT5Tj4w4nlxwIeBTwS8N8jyz+BhwLPmHGC8ZQ3ARda4aAQhiHlNQjgI78GbgW8d2YQVwdeC7gqjCg/Bm4KfHxm8O6lXlbiKqt8E8IwpLwmAXzMjeKTy6z/12Q0Zyr7gssPxoAPAjcHfjkZt3ETV4N7remPEIYh5Q0IsBjLR4CbAT+bDM6TwZPKSWHNcR+2j/0beDzwOMB/L8tZy5J/qQ1GF8IwpLwFAVQRfEkgGaZyvRIzOPkGDjicHnW23wL4wIzR1wZeBZxywwGFMAwpb0kA1XwNPLrM+uU4gr+dHTB6eIkNHdH7458AbgL43l+WYwNPAB4MW327OYRhSDlAgIUD3Bi6QXSjuCyGN80j3L13VNe0z5DtQwB3/Mty+rL/udKa7cw9FsIwpFyBADbhEdHMoUfGqbhDNsR84oCDWqp6pvf8/vYZI64MGO49XdDAEIYh5UoEsBmDRS6Bz5pxxnlKjcEFgo7at/rnS1TvO5OO9fnDgMcCLv9RCWEYUq5IgIUTrHKx2sVw8rKcCHgBcJuot/akbxzfeL5x/WU5VUnrXquiHSEMQ8o7IIBNWu1i1YvVL1ORHM/ruOzsT8BdSnBravtlyub2LBXBt6kQhiHlHRHAZq16uQ/w4hlnGRa17OxclR0Zbe7rhbhzxTGuBk8DjhvtZEY/hGFIeYcEWIzTIhOrYZxZy2JO3DCp4dIe5CA7Twq8HLjBDo0MYRhS3gMB7MIZJdBzM8twqWHTVmVnvuOt05tbqS5Sonrn3CH4R+wrYOozVwBXgrmyM8OmBo7OtmNHT5t3d+9exSKYqdwJeC5wgj3YFJrEIeU9rQDLPnSmOeOmu2vLzgyjXmcPDreLt5Xz/dxp5YXArfdkxzArwLI/V5WdWYBi2VmN8/UchkbyjFcYpZzKecvm9Px7BH9IAjjoVWVnVywRttplZz8qsfxPzgBscsvVqUXEMrSKh5QbvAKmvj+o7Oy0pezsqpVm4/uBWwK/mrRnzsLo5d0q9bNNMyEMQ8odEEATLCszmzYVS83MOD4iUHZmvt6Qre1Pc/f2598fvg1qFXVCGIaUOyCANQXXAP6+wqH+7unh1Bs6/Rcld2/lzkHiLv9DwGU3bLvm4yEMQ8qNCeBtGcvIlqtorSxypk5n65lL2vVya3reGj1z9z+ZPO/mUp8tp3WN77svaHUhNoRhSLkhAX4KGFv/wRJARgcNEUsCa+1+PgHPvz8FeMAKElicYmDJbN1BuXvv6hmYWo5OngP4FODeY98SwjCk3IgAfwDc6S8ni84AvAcw+qZIEGsJPjqDxvWBVwDTsrPflrr8d87oTHP3XtywhGuZZF7U9JVk5nKfEsIwpNyAAM5Kgz3uyhfi7WQriyyoXBbLztwAPrVUJS//ZtmZq8XFyh8/W2b19yZtrMrde4vHtO43l3S0zeKPXcUh5ogVwjCk3IAAdyjJlYUjXAl0uJHAg+RdpY7gN5MHFkc4/3y/LXP3tmkhq/V+CzFkbTRwXxLCMKS8ZwJYRu2xbiGWkRn+Xed69PfLDF/3Lv2lS35huqrMgWrq2hjBW5Z+9A6ENYD7kBCGIeU9EsB39vLdODdyT9+wGMKjonoWlKwScw1uBDfJ3XvquD/wnNKwfvXo6WZ01xLCMKS8JwJYQ++Gy7pBgzvG4S0W2VbMHN4RcDO5LOburTEww7etGBWUZJ4mTFG/D3ADuUsJYRhS3gMBvgR4pVywDLo4q2oUV3yrAP3lMoaaVUZe5rTU3Yzlycq9v10WtIYwDCnvmAAmXzzre5HC2zIez9YN5Kwz4/4C+B0jfVC7zvBjgMdNj5bWABoj8A7kLiSEYUh5hwQw22eU7yvl+0IupZaHH05ijaDHRDegFwYkhcGq2hLCMKS8IwK4WdNxHwYuDry7wuWJ2k5ftz0DUu5frGHwKrxj2WRzuU4/IQxDyjsigO9P3/WSwA1bixz7Oo5f9xk/8uTG0uCV9xo80dSUEIYh5R0QwMidFT0GfLxccaR8UMoIpvcFrBA2fW1Mo5aEMAwpVyaAdwD9LJr5dz8fcySKY3tMue/oUbSGhDAMKVckgIkcj3de/zroY0g1nNVDG64Cnj4sLL1mBYNCGIaUKxHAzJpJFN+NFm+MIJ5qJLqbwkVCattxhzAMKVcggOfkq5R340W39cBhquftYV8DVhStSmYdanghDEPKFQhgE1b0HKmfhDkUeE6ACPi2H8IwpFyJAIdyUv6+2gMhDEPKSYAuuBnCMKScBEgC6IHpV7668MpARoQmcUg5V4AuaBbCMKScBEgC5CugPQdCkziknCtAe/QzDtAFBk2NCE3ikHKuAE2BX3QewjCknARIAuQmsD0HQpM4pJwrQHv0cxPYBQZNjQhN4pByrgBNge9mE9iFF9KI7TxQYwXYrufU6sIDSYAuYGhnRBKgne+76DkJ0AUM7YxIArTzfRc9JwG6gKGdEUmAdr7vouckQBcwtDMiCdDO9130nAToAoZ2RiQB2vm+i56TAF3A0M6IJEA733fRcxKgCxjaGZEEaOf7LnpOAnQBQzsjkgDtfN9Fz0mALmBoZ0QSoJ3vu+g5CdAFDO2MSAK0830XPScBuoChnRFJgHa+76LnJEAXMLQzIgnQzvdd9JwE6AKGdkYkAdr5vouekwBdwNDOiCRAO9930XMSoAsY2hmRBGjn+y56/i99mnKQG6IuYQAAAABJRU5ErkJggg==";
}, false);

emailImg.addEventListener('mouseout', function () {
  emailImg.src = "data:image/png;base64,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";
}, false);

emailImg.addEventListener('touchend', function () {
  emailImg.src = "data:image/png;base64,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";
}, false);

emailImg.addEventListener('touchstart', function () {
  emailImg.src = "data:image/png;base64,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";
}, false);

githubA.addEventListener('focus', function () {
  githubImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAQB0lEQVR4nO1dCbRVVRn+3kNkcMopQJ+iaOWAZuKsIQlqDoljy5zQUCyLNEcSHCCnFDRWaqGmJkkImqAp6sOUQcMWqSDmQ8TETAIU8IFoPni39a/13bXuuu5/n33O2efec88931p7LYZ79tnT2fsfvv/fQI4cOXLkyJEjR44cGUITgAEAzgdwA4D7AUwFMBvAXACLACxmWcR/m83fyG9/CWAwgP6sK0eK0YUTJRP9VwAfAyh4Lh+zbnnHEXxnjiqhAcBBAK4F8AKAzxOY8EJA+YwL4hq2RdqUI2HsAOAqbtmFlJUlAG4BsGu+CvxiEwBDeD63p2CiCwFF2jgLwAVse46I+AqAEQBWxJiMdQBeB/AIgJu4e1wI4CwAJ1FIHMA/n8X/u4q/ncRn18V4/3IAwwFska8Cd2zLCfgk5GCLHPAigOsAHAWgp6dzuRHATqxT6p4RQeZYTeFxm3wh6BCpeiSAT0MM7AIObP8KS+VduXPcCODNEO1dS8G1cwXbWhMQteqtEOrYOACHIT3YkwLgfx378A6AY6vd6LRI9X92HLRnARwHYCOkFx0BHA/gOcc+PVrPRqbzuCUGSdSPA9gftYcDAExx0FzWABiEOoKoRg85TPyfAPRG7WMvaiFBC+GBelAbdwfwRsBAtFDAyhq+7dD3t7hgMomzA3TqVgCXpfyM9yEjXMFtXxsH0YLORMYwLGALnAZge9QPmijU2o5AWSg1DzHE3GrpaBuA62lsqTc0ALgYwBeW8Rlby2MjW/nvLZ37d8p0+WrhQAD/sozTeB4dNQVp8F8snWoGsHW1G5kiiIn4ect4PVFLi0C2tgctnRHDT24K/TI2BjDRMm4P18pxMMbSibtqpRNV/Hhut4zfb5By/MLSeLGV53DDVZZxvBwpxTkWVU9oUznC4TqLingGUoY9LW7cu6vduBrGr5UxFR/KHkgJxH79T6WhEx3P/N0AvEr//hwaSe6hZbAvBaRaZDQNJKtpAoDppJ63UKrf1KGODgAmK2O7gLyEqkNz7Ex3nLgdAXxgOfOK5tHHSd1K82LYEsBFAF4CsD6gT886qnadyD421SHxC1V36Zoa9r6jnt9AWrdtoEx1X8yBCYuOpIqJU6pPCSewD7fUnhH17R7croPc2+VFznlXmpz2kYjsVRXsqHRYzLuHOtZxfMgBKy2LA1g13QGcSrVqGqnkbQ71fsHfPg1gNIATLVy+DpTKW2PEFnzVcaz6Ku1vrRapRGPyiOPHFVNiLICiRHwX+YCNdLnKl/h2zHoLhvcsIAdwb7a9JwmicesWlc8Vw5U6hMFcURyrNGRaCENPo+IWXQrgSQpLG0Jw7D70POmFAL/9asffigv8HwAeU/ojMQQIMWYa3exoVAhdOOCmrWj7kHxAU0cuKfmN8Om/Ryk6Dj+/0mUpj55DyoTWSQrJFSHHzfThvB1RLgqNkUqnRWULg75KPdoi2pwRQks8TJAM4LKS6OBlASQN1yLRS8dQNjBhoPJc2MCRK6tlcNtWMfjMj8DkOcVQj9Cqg9DZgVVTLAsB3AvgJwzs2NkyOeD/9eJ2OpRq1rsO71nEyQ1Cd+X5sEadjko8wpqkvaw3KQKSCF9hcbKhrnkhnt+NC6/0+Ta6oYV+th38oaclPvER7k6uMEnyUax6hyum91FI0LJlEnyEvRsFpu3wtQhWyCdIthzKHSpp7ArgZgAf0coXFqawsm9EbItJpliVVCziCOXr7x0jGqi8Pjnfw6Ja7uWNIgrQpiMgqh6/t7ILiFfWKzZRonTFPBsVvRXDSJaxq6HPG2IyoacqUcle/QRDlJW7f8wjxVRnltnB3zX0V0y8cSOQTOMouZG8YbbizIgLk/FGIn2ziisV41lcNBvqFSulF+yinDMSqBkXzxjqzQQfXsHEhJhSJp9KO9Xe2LjeUPkyTyzVawx1y5mWRTTQQljeXx9h4hspoenX+Gi0yex7B/ygn2IazSJxtLehr20hbQg2jFUMVLGypBysCBj7emp0F0UvzmKA5FBDP//msf79lLkSITEyrjVUKG5RnwyaTzz4FWoB0wz9nOn5HSbzsLiQI8PE1pGcPEhw25LyfWQPv1X66uJDiGOqF2qe1+3Zl5q2uxIYKREwWURXeh5N57QvnuORhvrXRY3E6m+o7HOP2bhMjKKVALohuzhK2QWESOprkZk+2u9EqewGQ0WSh88HdlBYsz9C9jHB0G9xZvnCDF8eQtP5L0JhUqSS/9RSBGzMIBqTYc2VSBsloiiSHGBKuS5bWFw0crKTWly1gOkJcvyPVpxDodCknFVCjIiLbxrqXU+2TL3gNMMYfOgpte1OytxJ7IIzBhgq+NSThe5nhrr/jvrCtsox8HUPdTcqBFqxujrjfEMFkjk7Ken/V6g/tBjGQXYGHyinyhUYxRVLAxDuW1IdF29WvWGiYRzEXewDk+NqAqbkTmJl8oGVhrr3Qf3hHsM4SCiaD9xsqFvY0c54IiE/fUfl7AsloGQ49n+sp7qHxaXvmRhAP/bQsG0UCTUVce4Vxm2GcZBF4QMXxXU8zTNUIFeqxMVmygLYCvWHuxN0tJ0Tl3JvurxBwqR9qChtCdkXag3jY0YK23CioW7J4uKMxQl6Ad831F2PGUNnGsbBV/Inkx1H5jTWAhA37Z0A/sjwq5dIQCgGWK6ghF8sH5f836vMj/Oikkzhh6g/LDWMw2wyfJs5XnNJyVuslLdpRHuOavo4kkzHxV0Arvf3+CpClqgnNFV4fEMfAa8rlaznl76Q2byameVjUlm5n6vwYf69md7FucruIiu5nnCeYQzWcWzeLNktm2nUKR3bqSW7RDPdv/MZYGK7ce21uGqgXKroA9sptoAsEkE1PJlgGtjOCgF1Ztx4M18SKrjCkzKCpB3bK2QYH652W8pe8cHEMgXbYgG6MF7/MObyu5BBCWN5FExkA2TLepmh1eX1t4bImFXLuN2yRTczO9kk5l8cR/OwWPYGk0B6KL2GnUNaGe+N6wx6jDb7HzBbljTylRCXJbqU1GfDjomdPV91v5RzMJlzciZjNkweV2FhOWOwx0au5CIpFXBmKV7B9RGzjdQCGpWMn//jeMyl8F1U8VZ6yltULOfGZQSb4gPnUP8Uu/ZPmfalL1OedAvIx9OkSK1LMnrJ8nBlHOV+BRs6UXDei6SOU0iqGc1deA7nImi++oUVVEyVjGBuGl+JiEyBpwUaN8RvkBWco2g+y5knwQe2ogym3dkQmnJnEtROgF90ttgcZmXESTTIkqJWUtn6xkAfpFAo55XPsLDSCCHNgNHiiSdXrTN/pOUSDSGEJIEbfdHCTZqA2JyTwEmW9Opr6d/2wZitFHpxB9PO4xkeI6xcKOejfGXxak0wX/8FAbeLvuQxeCIpbM4Px2aSfT2pNG4UGNfGFQCL6MKsXeWVycJICucG3KQp5SlazdK0I/RgRM7ygLbPSjiTpxYcGjmHsEkOEJXPNYfdTbxD8Faqli6T1l+JSjLJByOqeHfOpqRxT6YuH9TeCRW4L3GMz/BwLYePGHNcDEmmM32+I/mjR8i7BFpIsTqLkTFJoCtV4OE017pmL/+ogrd8mYxrV8ep8CClUzYad7eAL0LO+d85fg1nKAkqg8pqmkgf4CIeQhX2YBpUerFsycUmf/5ayTUyYlL9Ob+op2iZc727oNx8XqmQt30TyOWoJomyHQMnOA7OHMeEzpsxYMLF2pWW8jQvha62k0l4G4mEG39gMfMeGGKg3ufdQ65b8CWWK+qqXdbxnI+VlCkiOihJN6Mks/4Seinq2UDLrmEiPGjlTW7FYSOMhfv2XpUnvY0u3EFVNl2b7l5o9ykPmYwaQvHSILaCP4QYyJkRVZUGagEXUNtYlPCEryef4Wbm/XW5/LESmJFkqlhwgE0DIl+iDbeGGNwJHnT7bp6ulClYFoDcYZQmfEtpq2hiXtPFL1cmLcge/nSIAb4rwIVsQyd6EbW6l9BOfmrJhZEDyspRdGs/ZrFKrk0Zf9EUZbwsiXA7kz97g8Ng9AwwjZaXKREyhck77lPq20BhKKwR5gDLkTKvUjd0BWAfRT0Nc3ejM7ZQroxxiTq9I4JE/Qh920PKylASVEeRfj7P8rV+RgEpKroryRYSuZUjAkzC9kqP+YedPITtvB8vSlq4dzxz5MqLXB4VFzsqpulVEbQXnzhc6bOQbBLDNoq36TWHa09MVPMVzA4S9tJllyKmYSQYbFnwlOs/ap6FNxRvbeIkGlMC6QJ5ajYcozx3MlW5Vz1O/ocJqGjPKANejdwGlyn9jmX3d0VnRThaHWDVa1See6HEdjDMwaXqUryqQCXp2NsTypsQllpuCrBtqaRgarr8qDiZjSEzV5TnHtiYt2jcyDsJnymLhSvGIo6jSbq8rndjqJJBeL6CLCkTOliYRqLGVhSPKg253PJMV8W791EE50mjUpcX+7eFsFL+vvVJSt0OuX8KtAVUHE1K4MLnAZN5tcWuPoZEEhf0MdSxIeFr5zZTtBZh4iSNQxQ3e9hb271ikDKZH1j84J0U4kK5JasYK6eVBTHvHo4K0xYsHtMk0UPx9lVDBvkSHlAaNstCIN1dyRcYt1QiwvgWzzeoBmFjEmJN/RXrZ9WxiXJXTYEJIhotZkxTvqCKxb9FxNmG98oEJYFGCsKmvs5PU3q9PS32flvuu625iqPQrUxFtJNq3PqxMKF33an0cw130VThTItN/lqHS5Vv8+DPF109aeznK/QqAKOUPsoYn46U4grL5LiGlW1HnfZ0gyOotJg0ENEMkkYfw3tFHU1aziiWS5FyjLY0fozHgI4VGVwADZar9GomrX4D3bRaJyZ5iovL2gLoxByM2riNT1k0VKC3ypRxvFhe9pAPKEsLoDtp8tp4TXHwtqZyETwUQNGSQI16XwCHBqjDD9bi5BfRECDQtJHA0FiHC6ABwMUBwbBjs3KT+uUBod/PReCw1/IC2FmJ4y+W9lqQ9sPijADmz1pG/nTI8ALoQDKHjSS7Js16flzsoThxSstcx4QGtbYAjnBgPc1nws1Mo2uAmlgsUwPMnbWyAPZwDJW7L8G0MalNnWaiNpWWDbQb9KnBBbAfk0cE+Tla0+DSrRaaOMFBX0dRUDyp5ILpNC6Ajmxjs2OfJlaTzJEmHM07A1zz496i7B7VWgCtbJPpFhBTaakGhy/t6MRsHnHy41ZrARQcSytD7JLKtJYJbE1X6KoIAzyDyRmP85yapTvrHKmEYgeVlTR4ZSHzacWwOePv4sQJrGKuoPH0Ul5KRs9pJHIOYDmS/3Y2fzOaz7wScSGWchuHVZA1nFm18XwmkbBZE9NS2rlLDE4TZSsr2IGRwQtTMNGFsvIeBcFdqj1I9YIDKFBND5Gzz2dZx3dfHTcVWw4/8Yr9KDxOj5hbsBBQlrPukXxXGhJE5AiQ3Pvxjr6RNLU+TlliLnXxxSxv8d9m8jf38ZlzGYdfqWSPOXLkyJEjR44cOXIgcfwfcyV7LxAEZgwAAAAASUVORK5CYII=";
}, false);

githubImg.addEventListener('mouseover', function () {
  githubImg.src = "data:image/png;base64,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";
}, false);

githubA.addEventListener('focusout', function () {
  githubImg.src = "data:image/png;base64,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";
}, false);

githubImg.addEventListener('mouseout', function () {
  githubImg.src = "data:image/png;base64,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";
}, false);

githubImg.addEventListener('touchend', function () {
  githubImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKU0lEQVR4nO2dfZRVVRXAf+MwUpAWooamVKAh1lSrssZVFCYmJZLZKslKzYC+o7IkNRWLlpi2amy1yDIqzJIwP0izLMISP2JVfi0VGbWUzEYCEqmpgLmtTXtWr9e7zL3vnnPuufec31r7j3nzPvbd59xz9zln730gEolEIpFIJBKpEQcA04DZwEJgCXAtsBr4DdAHPKTSp6+t1vfIez8HvBc4Ur8r4jFP14aShv4FsBFIDMtG/W7pGK8Hnlb2RYdMB9ADnAOsAgYsNHgyjAxohzgbeJXqFLHMgcB8YF0JDZ4MI48Ai4CDYi8wy2hgDnAzMOhBQyfDiOj4K/U9RsXO0D57APOAxz1o1KRN2QAsAJ4VO0J29lajbfKgARNDsgXoBcbFjpCOeNXnAls9aLDEkjwFfAYYGTvC/yLTqvs9aKDEkci6w/TYCWB/YKkHDZKUJD8CxofaEU7WITEJXLYA7yawVbteDwyfeCZLdcpbaw4B7vbA2L7K/UA3NeWdwN88MLLvshV4BzVDFnR2eGDcqsggcDo1oEPXx8s2aFWlF9iNitIJXOqBEevgHHZRMbo0sKJs49VFrgFGUKFhf4kHRqubfLcqMQcXemCsusoFeM7pHhip7nIaHs/zqxCwUXUZBGbhGS+Mizy4XiyajEdr+3d5cGeEJvf4EnL2LQ+MEap8o+zGP8nwBf0aWAM8APzDAwMnhmSz3rG3WIhoFt+rFA4wvJ9/VdM8VxY+DgVOBa6sWOzAemAx8GYNZW9EAkQfNvhbT2pgjXOWG/ZsJ2aIEp4L3OdBAycpcgPwpgzr9yca/t0rcMzRhi/gtpx7DBJB81jG7/6n7rNfq4tUp2lHmgXMVJmlr8n/LgJWAGuBf2X8jVuBw3NcwyiNBDJpQ8mDdBa922dY+c+2oceeKQ6oTJF+rBlEPQXX0LuA12gk78oWfon8/ZE2d+yuNmzDta6ijc8xrHiizmS7zFb/4DodWm1OjcYAHwRuBx7VnECflszPwkHSho24fQkLL0IZO2UjCn7+wxbsKI+VvbDIQgtKi0wlPN5vyZaSVWWFZ+p8NnYAvzvAJvWPjHOWJYVFjiM8Pm3RnuIAG0UcqycsKixTsND4ikV79pt2hudYVLbdaWDVucayTaW+kTFutqysrCqGxoOWbXqTKUUnOAj0kOXdkBjtIE9C2ux5JpRdYFnRIWXHEg5vcGDTRFcwC9HhYKgaEtk5C4XzHdl0XdFI4h5Hiia6CRMKtzu062FFFD3boaI3EgYjHMdPnllE2VUOFT2KcFjo0K4/K7LtO+Aw6yUkRur2rQvbDrRb1vZIRwpKSNOzCY/pDkeBqT4PU5ICHSp3ObLxeb4+/2X+/wLCZY6jDvDzdpSzUXK9WX5C2IyyuMXeKLKRl4sDHfVM2RMPnSsc2TpXmdppjpSSqmGhM9dHR3C2A4X+ZM+mleIwRx3gFN9mABK6HWFnEKd3M4FvOlDo27H1d9KRIwHFWSLpCgcKeV/uxCEuEmElESUzq33fpKjZCLDNgb3lGBuvVqhCjANMyzZKHMgd5MDF4Q0X51GoxhzkqAPkCrt7yIFCEhUbYWd+YaJ+wCZdtWs8zfR3DSecDsnv9b15Hh3yucz0pawnX6K1fyVQ5OO6iPE2zYl/HfDyXcg0lZn6maL5gJH/bi2P0eDdbo3imt+i/aRNC/kAIWbvVJW3tGi/O/N8wW0ZU7glvHlf7X0va7rjj2i463v0tUP0vftpr93d3DVXlrdrjYH5emraIt0iv2QX8qWGkVg+9yFtn2Mb6hm0KmKRmZUtvuAPGsWy3uCZfiEFgrZCAmG2+xga5mIhKNEiC5UogGyJDziyc6IlcjLz9TZjz/q0FNoKLd9ykWbBztWh7nh9JEzRR8IkrfkTKntrQIzY4pVqm6PVST5ZHW05rv6rwPeBn+qZSxvaaJ+vFU0F36aJBtfrM0hKpcwAXgLsY89GkRQk0PP5+sw/UUv3XKb+299btN8Z5OBdLb5ACh0Wmarspw7gZO3xh2uPf2OAYWEd6qkf0+AoDznPLwKeW7DIwz0t2k86SWampAzxnU0VtCbqe6Va5SeBLwPL1Im8U5/xWWoKSfrZMwiHj2YctrfrcL9Oq6hep8fwnKfRVMfq7KvxdPLOlHD+V+dR8DkpCl2q+/jrLGxhit8RApNThuiiskGH/ytT/i8jcC76LSg5nMijp86MKamy+uPtKHt9CYrKkHcC9WS0g0IbRqaALusCpJV2rVuq+J5asSMpSWSGkJsZJSo8qEudnTV55t9boi0TTUPLzViHy5RpsrId58Wjqd6plhy+PLJNfY+2uKVk5ROdRi6q2DTxFRqClXggvyxyIWd6cAFDsl5Ln7WV6uyIbuByz05Pk6X4tnmpAQVM1xjYpOFkYmxfDs06RbdbEw/lxUWfY48W+HHZL0DjAC62EP16h4aXH6UN4YoJuhJ3tYWDH0yKbOGXWtFKGmh8w3d1a4ybjYsd0JT2Xm2cqQY2qTp1n+KtGnyxzGHVNBMiGV6FmVRQiX59lDSmRC9zaIQtGkS5RkPRe3RRppnRGtd4gW6m9Dso5mhTBjXi2AhFZwOPNZ2e1eEo/WzIEEtyGmOixjP45MxZTQRxkS28sin6p0tP2bJphCcKHqY0XWsYJRWU92CQUW1GoTSLnPbViMztf2vJAA9rwERRuoFHPGjQPPJnG06xiaKRD+qd38g4wwcpJtpZjRRKbngk/MWDhs0quaJ/sjLG0JSn1dHn4w1uk263dIbeEY7SuIvKk3q8jxUuNOQLpJ0MmhbMkGcqOM/WxQOf8qCBhxNZNrfGvgacIvGsDx7mTlueIfdANln+qKnsi3XjpTE0ylad37s9aOQ02ewiQNfEXSAjyXDspokTE5pkr5L3A6Z4PD38hAsD7G7gCPTNKYsxVeEGDxq7lYPt5OhYNMGjqMLvo7pM96DBm0UihJ1SNH2sz2WPNUyHoyIaWeWqMowwzsDc+ItUl4UeNPzQamdp1dZPMHAB51Y0QfS1HjR+onmEpbLM0NqAZLhUiS5LJ6nnke/hScizqdMv1mg4+vFaQnVSi2lgs+xf4rXfW2Lj36eLZ14gDfXXKiU9GOLGkq5ZluQPxTOOK2mBRIIwy+LyEq53RxlTvqy0qk1jWyQnviwuq1qUrwukKkjsAIRbXLND08jjCIBRG3ynStNl2TX7YXwEYKrxl1cxT7LT0UhQdx9gqd5QlUSGrC/EDkC7jd9bpWF/V5xhcYpYxxFgh8Zd1IpjLJ2RV7cOsEUriNWSg1NKmMUOwE4brNWCErVmD93EiB2A/ztBvUo1EAozQ88ODH0E6Nfk0yDZR+e4oXaAH8Qyu/9BNjceCKgDrNURMNIUYPGxNs4ikJyAslicU9eNWia2OT0u0lSd7Pwc8QVy2kZZzMuoo0x/P685DZEcs4V5mv2TZtitJZeqHws8NYyDt8BBxlKtGamHJ9zUtJo42CLdvAxOaqHXKn29qmHv3jJB76hbPYuKmak6LTBUkyASiUQikUgkEolEIpFIBNP8G5S29DarSiN4AAAAAElFTkSuQmCC";
}, false);

githubImg.addEventListener('touchstart', function () {
  githubImg.src = "data:image/png;base64,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";
}, false);*/