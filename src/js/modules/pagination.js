const pagList = document.querySelector('#pagination');
// const btnPag = document.querySelector('.formatting')

let totalPages = 30;

function element(totalPages, page) {
  let pagLi = '';
  let beforePages = page - 2;
  let afterPages = page + 2;
  let activeLi;
  let pageLength;
  const svg = new URL('../../images/icons.svg', import.meta.url);
  if (page > 1) {
    pagLi += `<li class="arrows position formatting">
        <svg width="16" height="16">
          <use href="${svg}#icon-arrow-left"></use>
        </svg>
    </li>`;
  }
  if (page > 2) {
    pagLi += `<li class="numb position"><button class="formatting">1</button></li>`;
    if (page > 3) {
      pagLi += `<li class="numb position"><button class="formatting">...</button></li>`;
    }
  }
  if (page == totalPages) {
    beforePages = beforePages - 3;
  } else if (page == totalPages - 2) {
    beforePages = beforePages - 2;
  } else if (page == totalPages - 1) {
    beforePages = beforePages - 2;
  }
  if (page == 1) {
    afterPages = afterPages + 3;
  } else if (page == 2) {
    afterPages = afterPages + 2;
  } else if (page == 3) {
    afterPages = afterPages + 1;
  }

  // if(page == 1){
  //   afterPages = afterPages + 2;
  // }else if(page == 2){
  //   afterPages = afterPages + 1;
  // }

  for (pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > totalPages) {
      continue;
    }
    if (pageLength == 0) {
      pageLength = pageLength + 1;
    }
    if (page == pageLength) {
      activeLi = 'activePage';
    } else {
      activeLi = '';
    }
    pagLi += `<li class="numb position ${activeLi}" onclick="element(${totalPages}, ${pageLength})"><button class="formatting">${pageLength}</button></li>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      pagLi += `<li class="numb position"><button class="formatting">...</button></li>`;
    }
    pagLi += `<li class="numb position onclick="element(${totalPages}, ${pageLength}"><button class="formatting">${totalPages}</button></li>`;
  }

  if (page < totalPages) {
    pagLi += `<li class="arrows position formatting" onclick="element(${totalPages}, ${page + 1})">
        <svg width="16" height="16">
          <use href="../../images/icons.svg#icon-arrow-right"></use>
        </svg>
    </li>`;
  }
  return (pagList.innerHTML = pagLi);
}
element(1, 1);

// console.log(element(totalPages, 5))
// btnPag.addEventListener('click', () =>{

// });
