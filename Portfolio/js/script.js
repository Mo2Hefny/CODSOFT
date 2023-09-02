const portfolioSections = document.querySelector('main').children;
const scrollDownBtn = document.getElementById('scroll-down');
const largeNavigation = document.querySelector('.large-nav');

window.onscroll = function() {scrollFunction()};
scrollDownBtn.addEventListener('click', scrollDown);

function scrollFunction() {
  console.log(document.body.scrollTop);
  console.log(document.documentElement.scrollTop);
  console.log(largeNavigation.offsetHeight);
  console.log(vhToPixels(8));
  toggleAccordingToScroll(document.querySelector('.about .separator'), 'invisible', vhToPixels(1));
  toggleAccordingToScroll(scrollDownBtn, 'light', vhToPixels(8));
  toggleAccordingToScroll(largeNavigation, 'light', vhToPixels(92));
}

function toggleAccordingToScroll(element, addedClass, height) {
  if (document.body.scrollTop > height || document.documentElement.scrollTop > height) {
    element.classList.remove(addedClass);
  } else {
    element.classList.add(addedClass);
  }
}

function vhToPixels (vh) {
  return Math.round(window.innerHeight / (100 / vh));
  }

function scrollDown() {
  let i = 0;
  let found = false;
  for (; i < portfolioSections.length; i++)
  {
    if (portfolioSections[i].classList.contains('active'))
    {
      found = true;
      console.log(portfolioSections[i]);
      break;
    }
  }
  if (found)
    portfolioSections[i].scrollIntoView();
}

