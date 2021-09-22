let avatarImg;

//get current year;
const date = new Date();
const currentYear = date.getFullYear();
document.getElementById("current-year").innerHTML = currentYear;

function dropdownFn() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onscroll = function () {
  const tabHeader = document.querySelector(".tab-header");
  const sticky = tabHeader.offsetTop;
  // console.log("tabHeader :>> ", tabHeader);
  if (window.pageYOffset > sticky) {
    tabHeader.classList.add("sticky");
    document
      .getElementById("tab-avatar-img")
      .parentElement.classList.remove("hide");
  } else {
    tabHeader.classList.remove("sticky");
    document
      .getElementById("tab-avatar-img")
      .parentElement.classList.add("hide");
  }

  const tabHeaderS = document.querySelector(".tab-header-s");
  const stickyS = tabHeaderS.offsetTop;
  // console.log("tabHeaderS :>> ", tabHeaderS);
  if (window.pageYOffset > stickyS) {
    tabHeaderS.classList.add("sticky");
    document
      .getElementById("tab-avatar-img")
      .parentElement.classList.remove("hide");
  } else {
    tabHeaderS.classList.remove("sticky");
    document
      .getElementById("tab-avatar-img")
      .parentElement.classList.add("hide");
  }
};

// Get repo public key
// fetch("https://run.mocky.io/v3/65648339-fd40-4f87-8f14-5220868e9f49")
//   .then((response) => response.json())
//   .then((result) => {
//     // console.log(result);

//     getRepo(result);
//   })
//   .catch((error) => console.log("error", error));

// get repo details and append to HTML
const token = "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"

getRepo(token);

function getRepo(resp) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + resp);
  myHeaders.append("Content-Type", "application/json");

  const number_of_repos = 20;
  const query = `{
    viewer {
      login
      name
      bio
      avatarUrl(size: 260)
      repositories(last: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          name
          updatedAt
          stargazerCount
          forkCount
          description
          shortDescriptionHTML
          primaryLanguage {
            color
            id
            name
          }
          licenseInfo {
            name
          }
        }
      }
    }
  }`;

  const graphql = JSON.stringify({ query, variables: { number_of_repos } });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    //   redirect: "follow",
  };
  fetch("https://api.github.com/graphql", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result);
      avatarImg = result.data.viewer.avatarUrl;
      document.getElementById("small-avatar-img").src = avatarImg;
      document.getElementById("big-avatar-img").src = avatarImg;
      document.getElementById("big-avatar-img-s").src = avatarImg;
      document.getElementById("tab-avatar-img").src = avatarImg;
      document.getElementById("tab-avatar-img-d").src = avatarImg;
      document.getElementById("repo-count").innerHTML =
        result.data.viewer.repositories.nodes.length;
      document.getElementById("repo-count-s").innerHTML =
        result.data.viewer.repositories.nodes.length;

      document.getElementById("about").firstElementChild.innerHTML =
        result.data.viewer.name;

      document.getElementById("about").lastElementChild.innerHTML =
        result.data.viewer.login;

      document.getElementById("about-s").firstElementChild.innerHTML =
        result.data.viewer.name;

      document.getElementById("about-s").lastElementChild.innerHTML =
        result.data.viewer.login;

      document.getElementById("tab-avatar-img").nextElementSibling.innerHTML =
        result.data.viewer.login;

      document.getElementById("tab-avatar-img-d").nextElementSibling.innerHTML =
        result.data.viewer.login;

      document.getElementById("profile-bio").innerHTML = result.data.viewer.bio;
      document.getElementById("profile-bio-s").innerHTML =
        result.data.viewer.bio;

      result.data.viewer.repositories.nodes.map((repo) => {
        const main = document.createElement("div");
        main.classList.add("main");
        main.innerHTML = `<div class="main-left">
      <div style="flex-basis: 70%">
        <div>
          <h3>
            <a href="#">${repo.name}</a>
          </h3>
          <p style='${repo.description ? "display:inherit" : "display:none"}'>
          ${repo.description ? repo.description : ""}</p>
        </div>
        <div class="repo-detail">
          <span style='${
            repo.primaryLanguage
              ? "display: flex; align-items: center"
              : "display:none"
          }'>
            <span style='background-color:${
              repo.primaryLanguage ? repo.primaryLanguage?.color : "#fff"
            }' id="lang-color"></span>
            <span id="lang">${
              repo.primaryLanguage ? repo.primaryLanguage?.name : ""
            }</span>
          </span>
          <span style='${
            repo.forkCount
              ? "display: flex; align-items: center"
              : "display:none"
          }' style="display: flex; align-items: center">
            <svg
              aria-label="fork"
              class="octicon octicon-repo-forked"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              role="img"
            >
              <path
                fill-rule="evenodd"
                d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
              ></path>
            </svg>
            <span id="fork">${repo.forkCount}</span>
          </span>
          <span style='${
            repo.licenseInfo
              ? "display: flex; align-items: center"
              : "display:none"
          }' style="display: flex; align-items: center">
            <svg
              class="octicon octicon-law mr-1"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
              ></path>
            </svg>
            <span id="license">${repo.licenseInfo?.name}</span>
          </span>
          <span>Updated ${moment(repo.updatedAt, "YYYYMMDD").fromNow()}</span>
        </div>
      </div>
      <button>
        <svg
          class="octicon octicon-star mr-1"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
          ></path>
        </svg>
        <span>star</span>
      </button>
    </div>`;
        const mainS = document.createElement("div");
        mainS.classList.add("main");
        mainS.innerHTML = `<div class="main-left">
      <div style="flex-basis: 70%">
        <div>
          <h3>
            <a href="#">${repo.name}</a>
          </h3>
          <p style='${repo.description ? "display:inherit" : "display:none"}'>
          ${repo.description ? repo.description : ""}</p>
        </div>
        <div class="repo-detail">
          <span style='${
            repo.primaryLanguage
              ? "display: flex; align-items: center"
              : "display:none"
          }'>
            <span style='background-color:${
              repo.primaryLanguage ? repo.primaryLanguage?.color : "#fff"
            }' id="lang-color"></span>
            <span id="lang">${
              repo.primaryLanguage ? repo.primaryLanguage?.name : ""
            }</span>
          </span>
          <span style='${
            repo.forkCount
              ? "display: flex; align-items: center"
              : "display:none"
          }' style="display: flex; align-items: center">
            <svg
              aria-label="fork"
              class="octicon octicon-repo-forked"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              role="img"
            >
              <path
                fill-rule="evenodd"
                d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
              ></path>
            </svg>
            <span id="fork">${repo.forkCount}</span>
          </span>
          <span style='${
            repo.licenseInfo
              ? "display: flex; align-items: center"
              : "display:none"
          }' style="display: flex; align-items: center">
            <svg
              class="octicon octicon-law mr-1"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
              ></path>
            </svg>
            <span id="license">${repo.licenseInfo?.name}</span>
          </span>
          <span>Updated ${moment(repo.updatedAt, "YYYYMMDD").fromNow()}</span>
        </div>
      </div>
      <button>
        <svg
          class="octicon octicon-star mr-1"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
          ></path>
        </svg>
        <span>star</span>
      </button>
    </div>`;

        document.getElementById("main-div").appendChild(main);
        document.getElementById("main-div-s").appendChild(mainS);
      });
    })
    .catch((error) => console.log("error", error));
}

// console.log(
//   'moment("20111031", "YYYYMMDD").fromNow() :>> ',
//   moment("2020-06-28T13:52:08Z", "YYYYMMDD").fromNow()
// );
