var cartShow; // chama o carrinho cart 
var rotate; 
/** fim var globais */

function ChamaMenu() { 
  if(rotate != false) {
    //document.getElementById('trigger_menu').classList.add("trigger-menu-show"); 
    rotate = false; // trigger-menu-show
    document.getElementById('menu_opttions').classList.add("menu-opttions-show");
    console.log("function ChamaMenu() show");
  }
  else if(rotate == false) {
      FechaMenu();
  } 
} 

function FechaMenu() {
  //trigger_menu.classList.remove("trigger-menu-show"); 
  rotate = true; // trigger-menu-hidden
  menu_opttions.classList.remove("menu-opttions-show");
  console.log("function FechaMenu() hidden");
}

/*function showPortfolio() {
  setTimeout(function () {$.scrollTo(690, 2000);}, 10);
}*/

const menuItems = document.querySelectorAll('.menu a[href^="#"]');

function getScrollTopByHref(element) {
	const id = element.getAttribute('href');
	return document.querySelector(id).offsetTop;
}

function scrollToPosition(to) {
  // Caso queira o nativo apenas
	// window.scroll({
	// top: to,
	// behavior: "smooth",
	// })
  smoothScrollTo(0, to);
}

function scrollToIdOnClick(event) {
	event.preventDefault();
	const to = getScrollTopByHref(event.currentTarget)- 80;
	scrollToPosition(to);
}

menuItems.forEach(item => {
	item.addEventListener('click', scrollToIdOnClick);
});

// Caso deseje suporte a browsers antigos / que nÃ£o suportam scroll smooth nativo
/**
 * Smooth scroll animation
 * @param {int} endX: destination x coordinate
 * @param {int) endY: destination y coordinate
 * @param {int} duration: animation duration in ms
 */

function smoothScrollTo(endX, endY, duration) {
  const startX = window.scrollX || window.pageXOffset;
  const startY = window.scrollY || window.pageYOffset;
  const distanceX = endX - startX;
  const distanceY = endY - startY;
  const startTime = new Date().getTime();

  duration = typeof duration !== 'undefined' ? duration : 800; // Tempo em milesimos em seg para a roagem

  // Easing function
  const easeInOutQuart = (time, from, distance, duration) => {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
  };

  const timer = setInterval(() => {
    const time = new Date().getTime() - startTime;
    const newX = easeInOutQuart(time, startX, distanceX, duration);
    const newY = easeInOutQuart(time, startY, distanceY, duration);
    if (time >= duration) {
      clearInterval(timer);
    }
    window.scroll(newX, newY);
  }, 1000 / 60); // 60 fps
};



