import decode from "jwt-decode";

class Authenticate {

    constructor() {
        this.domain = "http://localhost:5000";
    }

    loggedIn = () => {
        const token = this.getToken();
        if(!token || (token && this.isTokenExpired(token))) {
            return true;
        } else {
            return false;
        }
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000)
                return true;
            else 
                return false;
        } catch (err) {
            return false;
        }
    };

    setToken = (data) => {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        this.getConfirm();
    };

    getToken = () => {
        return localStorage.getItem("jwt_token");
    };

    getUsername = () => {
        return localStorage.getItem("username");
    };

    getUserId = () => {
        return parseInt(localStorage.getItem("user_id"));
    };

    logout = () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        return window.location.href="/login";
    };

    getConfirm = () => {
        let answer = decode(this.getToken());
        console.log("Recieved answer!", answer);
    };

    requestAPI = async (req_body, api, callback) => {
        try {
            const response = await fetch(this.domain+"/api/"+api, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization" : "Bearer "+this.getToken()
                },
                body : JSON.stringify(req_body)
            });
            const response_data = await response.json();
            
            if(response_data && response_data.status === "success") {
                callback(null, response_data.data)
            } else {
                callback((response_data && response_data.data) || "Invalid response from api")
            }
        } catch (error) {
            console.log('api error in catch block  ', error);
            callback("Unexpected error occured");
        }
    }
}

export default new Authenticate();