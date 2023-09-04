const portfolioSections = document.querySelector('main').children;
let  portfolioSectionsStart = [];
updateSectionStarts();
const scrollDownBtn = document.getElementById('scroll-down');
const largeNavigation = document.querySelector('.large-nav');
const smallNavigation = document.querySelector('.small-nav');
const sectionScroller = document.querySelector('.section-scroller');
const sectionScrollerSpans = document.querySelectorAll('.section-scroller span');
const projectTags =  document.querySelector('.tags').children;
const projectCards =  document.querySelector('#projects-scroll').children;
let selectedTag = projectTags[0];
for (const tag of projectTags)
  tag.addEventListener('click', showSelectedTag);

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
  toggleAccordingToScroll(sectionScroller, 'absolute', portfolioSectionsStart[1]);
  updateSectionScroller();
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

function updateSectionScroller() {
  for (const span of sectionScrollerSpans) {
    span.classList.remove('active');
  }
  const i = Math.max(getCurrentSection() - 1, 0);
  console.log(sectionScrollerSpans);
  sectionScrollerSpans[i].classList.add('active');
}

function scrollDown() {
  portfolioSections[getCurrentSection() + 1].scrollIntoView();
  console.log(document.documentElement.scrollTop);
}

function getCurrentSection() {
  const scrollY = document.documentElement.scrollTop;
  let i = 0;
  for (; i < portfolioSections.length; i++)
  {
    if (portfolioSectionsStart[i] > scrollY + 30)
      break;
  }
  return i - 1;
}

function toggleMenu() {
  document.querySelector('.open').classList.toggle('hide');
  document.querySelector('.close').classList.toggle('hide');
  document.querySelector('.side-menu').classList.toggle('hide');
  console.log('working!');
}

function showSelectedTag(event) {
  const clickedTag = event.target;
  clickedTag.classList.toggle('active');
  selectedTag.classList.remove('active');
  selectedTag = clickedTag.classList.contains('active') ? clickedTag : projectTags[0];
  let tag = selectedTag.getAttribute('id');
  if (tag === 'all')  { selectedTag.classList.add('active'); tag = 'card'; }
  for (const card of projectCards)
  {
    if (card.classList.contains(tag))
      card.classList.remove('hide');
    else
      card.classList.add('hide');
  }
}