const portfolioSections = document.querySelector('main').children;
let  portfolioSectionsStart = [];
updateSectionStarts();
const scrollDownBtn = document.getElementById('scroll-down');
const largeNavigation = document.querySelector('.large-nav');
const smallNavigation = document.querySelector('.small-nav');

window.addEventListener("scroll", scrollFunction);
window.addEventListener("resize", updateSectionStarts);
scrollDownBtn.addEventListener('click', scrollDown);

function updateSectionStarts() {
  portfolioSectionsStart = [];
  for (const section of portfolioSections)
  {
    portfolioSectionsStart.push(section.offsetTop);
  }
  console.log(`heights are: ${portfolioSectionsStart}`)
}

function scrollFunction() {
  console.log(document.body.scrollTop);
  console.log(document.documentElement.scrollTop);
  toggleAccordingToScroll(document.querySelector('.about .separator'), 'invisible', vhToPixels(1));
  toggleAccordingToScroll(scrollDownBtn, 'light', vhToPixels(8));
  toggleAccordingToScroll(largeNavigation, 'light', vhToPixels(92));
  toggleAccordingToScroll(smallNavigation, 'light', vhToPixels(50));
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
  const scrollY = document.documentElement.scrollTop;
  for (let i = 0; i < portfolioSections.length; i++)
  {
    if (portfolioSectionsStart[i] > scrollY + 30)
    {
      console.log(portfolioSections[i]);
      console.log(portfolioSectionsStart[i]);
      portfolioSections[i].scrollIntoView();
      break;
    }
  }
  console.log(document.documentElement.scrollTop);
}

function toggleMenu() {
  document.querySelector('.open').classList.toggle('hide');
  document.querySelector('.close').classList.toggle('hide');
  document.querySelector('.side-menu').classList.toggle('hide');
  console.log('working!');
}