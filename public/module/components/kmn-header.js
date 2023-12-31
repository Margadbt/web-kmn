const style = `
header{    
    position: fixed;
    z-index: 1000;
    width: 100%;
    
    & nav{
        padding: 0 100px;
        display: flex;
        justify-content: space-between;
        background-color: var(--color-card-bg);
        box-shadow: 0 5px 25px rgb(0, 0, 0, 0.0);
        align-items: center;
        height: 4em;
        border: var(--border-card);
        & ul{
            display: flex;
            align-items: center;

            & li{
                list-style-type: none;
                margin-right: 5em;

                & a{
                    text-decoration: none;
                    color: black;
                    font-weight: 600;
                }
            }

            & li.last{
                margin-right: 0;
            }

            & li.active{
                background-color: rgba(112, 151, 116);
                padding: 8px 15px;
                border-radius: 8px;
                & a{
                    color: white;
                }
            }
        }

        & .right{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
        }
    }
}
#logo{
    height: 30px;
}
#pfp{
    height: 40px;
}
.mobile{
    display: none;
}
#mbtn{
    display: none;
    background-color: white;
    cursor: pointer;
    & img{
        width: 1.7rem;
        height: 1.7rem;
    }
    border: var(--border-card);
    border-radius: 0.4rem;
}


.mobile{
    position: fixed;
    z-index: 1001;
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8px);
    background-color: rgb(0, 0, 0, 0.5);
    
    
    & nav{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #fff;
        width: 200px;
        height: 400px;
        box-shadow: var(--shadow-card);
        border: var(--border-card);
        border-radius: var(--border-rad);
        & h3{
            margin: 0;
        }
        & ul{
            display: flex;
            align-items: right;
            flex-direction: column;
            justify-content: right;
            padding-left:0;

            & li{
                list-style-type: none;
                margin-bottom: 0.5em;

                & a{
                    text-decoration: none;
                    color: black;
                    font-weight: 600;
                }
            }

            & li.last{
                margin-right: 0;
            }

            & li.active{
                border-left: 3px solid var(--color-main);
                padding-left: 5px;
                font-weight:800;

                & a{
                    font-weight: 700;
                }
            }
        }
    }
}

.login-btn{
    color: white;
    text-decoration: none;
    font-weight: 600;
    background-color: var(--color-main);
    padding: 8px 15px;
    border-radius: var(--border-rad);
}

.user-header{
    color: black;
    text-decoration: none;
    font-weight: 600;
}

@media screen and (max-width: 1023px) {
    ul.desktop {
        display: none;
    }
    .active{
        display: flex;
    }
    #mbtn{
        display: inline-block;
    }

}

@media screen and (max-width:767px){
    header{
        & nav{
            padding: 0 10%;
        }
    }
}
    
`;

class Header extends HTMLElement {
  constructor() {
    super();
    const currentPageURL = window.location.pathname;

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = `
            <style>
            ${style}
            </style>
            <header>
                <nav>
                <a href="/"><img id="logo" src="public/assets/logoT.svg" alt="logo"/></a>
                    <ul class="desktop">
                    <li class="${
                      currentPageURL === "/" ? "active" : ""
                    }"><a href="/">Home</a></li>
                        <li class="${
                          currentPageURL === "/test" ? "active" : ""
                        }"><a href="/test">Test</a></li>
                        <li class="${
                          currentPageURL === "/community" ? "active" : ""
                        }"><a href="/community">Community</a></li>
                        <li class="${
                          currentPageURL === "/plan" ? "active" : ""
                        } last"><a href="/plan">Plan</a></li>
                    </ul>
                    <div class="right">
                        <div class="user-section">
                            <a class="login-btn" href="/login">Нэвтрэх</a>
                        </div>
                        
                        <button id="mbtn"><img src="public/assets/menu.png" alt="menu" /></button>
                    </div>
                </nav>
            </header>
            <div class="mobile">
                <nav>
                <h3>Menu</h3>
                <ul>
                    <li class="${
                      currentPageURL === "/" ||
                      currentPageURL === "./index.html"
                        ? "active"
                        : ""
                    }"><a href="/">Home</a></li>
                    <li class="${
                      currentPageURL === "./pages/test.html" ? "active" : ""
                    }"><a href="/test">Test</a></li>
                    <li class="${
                      currentPageURL === "./pages/community.html"
                        ? "active"
                        : ""
                    }"><a href="/community">Community</a></li>
                    <li class="${
                      currentPageURL === "./pages/plan.html" ? "active" : ""
                    } last"><a href="/plan">Plan</a></li>
                </ul>
                    <div class="user-section">
                        <a class="login-btn" href="/login">Нэвтрэх</a>
                    </div>
                </nav>
            </div>
        `;

    
  }
  connectedCallback() {
    const mbtn = this.shadowRoot.getElementById("mbtn");
    const mobileDiv = this.shadowRoot.querySelector(".mobile");

    mbtn.addEventListener("click", () => {
      mobileDiv.classList.toggle("active");
    });

    mobileDiv.addEventListener("click", () => {
      mobileDiv.classList.toggle("active");
    });
    const pfpElement = this.shadowRoot.querySelector(".user-section");


    async function fetchUser() {
      try {
        const response = await fetch("/user");
        const user = await response.json();
        console.log(user);
        if (pfpElement) {
          // Use innerHTML to set both the image and the user's name
          pfpElement.innerHTML = `<a class="user-header" href="/profile">${user.fullname}</a><a class="login-btn" style="margin-left: 10px; font-size: 15px;" href="/user/logout">Гарах</a>`;
        }
      } catch (error) {
        console.log(error);
      }
    }
    // if(!document.cookie.match("session_id")){
      fetchUser();
    // } 
  }

  adoptedCallback() {
    //implementation
  }
}

customElements.define("kmn-header", Header);
