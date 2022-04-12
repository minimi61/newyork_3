let news = [];

const getLatestNews = async () => {
  let url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=10"
  );
  let header = new Headers({
    "x-api-key": "FNgPNhFeSLFC1WyH24hqUR77hdoF_g2Ow3bcfZYHSY0",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log(news);
  render();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news.map((item) => {
    console.log(item);
    return `            <div class="row news">
                <div class="col-lg-4">
                <img class="news-img-size" src="" alt="">
                </div>
                 <div class="col-lg-8">
                     <h2>기사 제목</h2>
                     <p>기사 내용</p>
                     <p>날짜</p>
                 </div>
            </div>`;
  });
  document.getElementById("article-section").innerHTML = newsHTML;
};

getLatestNews();
