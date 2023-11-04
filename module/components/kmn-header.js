// Define a class for your custom component
class Header extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });

    // Define the component's HTML content
    this.shadowRoot.innerHTML = `
            <style>
            header{
                    padding: 0 100px;
                    display: flex;
                    justify-content: space-between;
                    background-color: var(--color-card-bg);
                    box-shadow: 0 5px 25px rgb(0, 0, 0, 0.0);
                    align-items: center;
                    height: 4em;
                    border: var(--border-card);
                    
                    & nav{
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
                                background-color: rgba(112, 151, 116, 0.74);
                                padding: 8px 15px;
                                border-radius: 8px;
                            }
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
                
                @media screen and (max-width:762px){
                    .desktop{
                        display: none;
                    }
                    .mobile{
                
                    }
                    header{
                        padding: 0 10%;
                }
            </style>
            <header>
      <img id="logo" src="/assets/logoT.svg" />
      <nav class="desktop">
        <ul>
          <li class="active"><a href="/">Home</a></li>
          <li><a href="/pages/test.html">Test</a></li>
          <li><a href="/pages/community.html">Community</a></li>
          <li class="last"><a href="/pages/plan.html">Plan</a></li>
        </ul>
      </nav>
      <img id="pfp" src="/assets/pfp.png" />
    </header>
        `;
  }

  // Define any methods or event listeners for your component
}

// Define the custom element
customElements.define("kmn-header", Header);
