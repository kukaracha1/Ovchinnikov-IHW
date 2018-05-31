$(function() {
  var menuElemC = document.getElementById('country');
    var titleElemC = menuElemC.querySelector('.title');

    titleElemC.onclick = function () {
      menuElemC.classList.toggle('open');

    };
    var menuElemP = document.getElementById('publisher');
    var titleElemP = menuElemP.querySelector('.title');

    titleElemP.onclick = function () {
      menuElemP.classList.toggle('open');

    };
});