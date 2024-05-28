var React = require('react');
var createReactClass = require('create-react-class');

var Info = createReactClass({
  getInitialState: function() {
    return {
      followers: 334
    };
  },

  handleFollow: function() {
    this.setState({
      followers: this.state.followers + 1
    });
  },

  render() {
    return (
      <div className="main-container">
        <div className="container">
          <div className="profile">
            <img src="/Joon.jpeg" alt="Profile" />
            <h2>xunssoie</h2>
            <p>JoonSeo-Han</p>
            <button className="follow-button" onClick={this.handleFollow}>Follow</button>
            <p>{this.state.followers} followers · 327 following</p>
            <p>Back-End Developer</p>
            <p>Incheon, Republic of Korea</p>
          </div>
          <div className="details">
            <h3>JoonSeo-Han, xunssoie</h3>
            <ul>
              <li><span>Head of Planning Department, Student Council of the ITE</span> (2021/03 ~ 2022/02)</li>
              <li><span>Incheon National University</span> (2020/03 ~ ing)</li>
              <li><span>YeonSong High School</span> (2017/03 ~ 2020/02)</li>
              <li><span>Sinjeong Middle School</span> (2014/03 ~ 2017/02)</li>
              <li><span>Myeongseon Elementary School</span> (2011/04 ~ 2014/02)</li>
              <li><span>Gajeong Elementary School</span> (2008/03 ~ 2011/03)</li>
            </ul>
            <div className="badges">
              <span className="python">Python</span>
              <span className="html">HTML5</span>
              <span className="css">CSS3</span>
              <span className="javascript">JavaScript</span>
              <span className="nodejs">NodeJS</span>
              <span className="springboot">SpringBoot</span>
              <span className="typescript">TypeScript</span>
              <span className="react">React</span>
            </div>
            <div className="stats">
              <span>hits 17 / 12033</span>
              <span>wakatime 357 hrs 43 mins</span>
              <span>solved.ac S2</span>
            </div>
            <div className="blog">
              <a href="https://velog.io/@ahh0520/Spring-Spring-게시판-무작정-따라하기mac-1">[SpringBoot] 게시판 무작정 따라해보기</a>
              <a href="https://velog.io/@ahh0520/spring-PostMapping-오류일지">[SpringBoot] PostMapping 오류일지</a>
              <a href="https://velog.io/@ahh0520/Spring-MariaDB와-mysql-workbench-in-mac">[SpringBoot] MaraDB와 마스큐엘워크밴치</a>
              <a href="https://blog.naver.com/ahh0520/223360952945">[Blog] Satellite - 2024년 2월 21일</a>
              <a href="https://blog.naver.com/ahh0520/223135096026">[Blog] SJ 2 EJ - 2023년 6월 21일</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Info;
