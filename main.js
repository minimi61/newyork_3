let news = [];
let page = 1;
let total_page = 0;
let stringmenu = 'news';
let inputText = document.getElementById('input-text');
let goButton = document.getElementById('go-button');
let url;

let menusButton = document.querySelectorAll('.menus-buttons button');
menusButton.forEach((i) => {
  i.addEventListener("click", (e)=>clickmenu(e));
})

function clickmenu(e) {
  let menu = e.target.innerHTML;
  stringmenu = menu.toLowerCase();//여기에다  let stringmenu = menu.toLowerCase();를 하면 그 다음 함수에서 인식하지 못하나보다
  console.log(stringmenu);
  getLatestNews();
}

const api_url = async () => {
  try {
    let header = new Headers({
      "x-api-key": "FNgPNhFeSLFC1WyH24hqUR77hdoF_g2Ow3bcfZYHSY0",
    });

    url.searchParams.set('page', page);//&page
    console.log(url)
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == '0') {
        throw new Error("검색한 결과가 없습니다")
      }
      console.log('받은 데이터', data);
      total_page = data.total_pages;
      page = data.page
   
      news = data.articles;
      render();
      pagenation()

    } else {
      throw new Error(data.message)
    }

    
  }
  catch (error) {
    console.log('잡힌 에러는?',error.message)
    errorRender(error.message);
  }
}

const search = async() => {
  url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${inputText.value}&countries=US&page_size=10`
      );
  api_url();
}
goButton.addEventListener('click', search);



const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${stringmenu}&page_size=10`
  );
  api_url();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news.map((item) => {
    console.log(item);
    return `<div class="row news">
                <div class="col-lg-4">
                <img class="news-img-size" src="
                ${item.media || 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg'}" alt="">
                </div>
                 <div class="col-lg-8">
                     <h2><a href=${item.link} target='_blank'>${item.title}</a></h2>
                     <p>${item.summary == null || item.summary == ""
                        ? "내용없음" : item.summary.length > 200
                        ?item.summary.substr(0, 200) + '...'
                        :item.summary
                        }</p >
                     <p>${item.rights||"no source"}*${moment(item.published_date).fromNow()}</p>
                 </div>
            </div>`;
  }).join('');
  document.getElementById("article-section").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
  document.getElementById("article-section").innerHTML = errorHTML;
}

const pagenation = () => {
  //total_page
  //page
  //page_group
  //last
  //first
  //first~last 페이지 프린트
 
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4 <=0? 1: last-4;
  let pagesHTML = '';
  if (last > total_page) {
    last = total_page
  }
  

  if (first >= 6) {
    pagesHTML = `<a class="page-link" href="#" aria-label="Next" onclick='moveToPage(1)'>
  <span aria-hidden="true">&laquo;</span>
</a><a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${page-1})'>
  <span aria-hidden="true">&lt;</span>
</a>`};
  
  for (let i = first; i <= last; i++){
    pagesHTML += ` <li class="page-item ${page == i? 'active':''}"><a class="page-link" href="#" onclick='moveToPage(${i})'>${i}</a></li>`
  }

  if (last < total_page) {
    pagesHTML += `<a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${page + 1})'>
  <span aria-hidden="true">&gt;</span>
</a><a class="page-link" href="#" aria-label="Next" onclick='moveToPage(${total_page})'>
  <span aria-hidden="true">&raquo;</span>
</a>`}
  document.querySelector('.pagination').innerHTML = pagesHTML;
}
const moveToPage = (number) => {
  //1.이동하고 싶은 페이지 알기
  page = number;
  console.log(page);
  // window.scrollTo({ top: 0, behavior: 'smooth'})
  //2.이동하고픈 페이지를 가지고 api를 다시 호출
  api_url();
}

getLatestNews();
