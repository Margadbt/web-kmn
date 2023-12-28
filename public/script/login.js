async function login(event) {

    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:4000/login", {
            method: 'POST',
            cache: "no-cache",
            headers: {
                "Content-Type": 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });



        if (!response.ok) {
            const errorHTML = `<p style="color: red; text-align: center;">Нэвтрэхэд алдаа гарлаа</p>`
            document.querySelector(".card").insertAdjacentHTML("afterbegin", errorHTML);

            console.log(response);
            return;
        }
        window.location.href = '/';

    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function logout() {
    try {
        const response = await fetch("http://localhost:3000/user/logout");
    } catch (error) {
        console.error("Error during logout:", error);
    }
}
