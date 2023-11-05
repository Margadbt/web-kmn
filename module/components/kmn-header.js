const style = `
header{    
    position: fixed;
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
`;
class Header extends HTMLElement {
    constructor() {
        super();        
    }
    connectedCallback() {

        const currentPageURL = window.location.pathname

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
            ${style}
            </style>
            <header>
                
                <nav>
                <img id="logo" src="/assets/logoT.svg" />
                    <ul>
                    <li class="${currentPageURL === '/' ? 'active' : ''}"><a href="/">Home</a></li>
                        <li class="${currentPageURL === '/pages/test.html' ? 'active' : ''}"><a href="/pages/test.html">Test</a></li>
                        <li class="${currentPageURL === '/pages/community.html' ? 'active' : ''}"><a href="/pages/community.html">Community</a></li>
                        <li class="${currentPageURL === '/pages/plan.html' ? 'active' : ''} last"><a href="/pages/plan.html">Plan</a></li>
                    </ul>
                    <img id="pfp" src="/assets/pfp.png" />
                </nav>
                
            </header>
        `;
    }

    adoptedCallback() {
        //implementation
    }
}

customElements.define("kmn-header", Header);
