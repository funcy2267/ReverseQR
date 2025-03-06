// chatbox
const chatbox = document.getElementById("chatbox");
const connectionStatus = document.getElementById("connectionStatus");
const messageInputContainer = document.getElementById("messageInputContainer");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageArea = document.getElementById("messageArea");
const messageMaxLength = 1500;
let lastMessageDate = 0;
let socket;

async function connect(uniqueCode) {
    chatboxReset();
    socket = new WebSocket(`${await env_parser.get('CLIENT_WS_SERVER')}/${uniqueCode}`);
    socket.addEventListener("open", (event) => {
        connectionStatus.textContent = "Connected!";
        messageInputContainer.classList.remove("loading");
        sendButton.removeAttribute("disabled");
    });
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message["type"] == "chatMessage") {
            messageArea.innerHTML += `<p class="chatboxUserOther chatboxMessage">Other user</p><p class="chatboxMessage">: ${message["content"]}</p><br>`;
        } else if (message["type"] == "connectionData") {
            pairDevicesHandle(message);
        }
    })
}

function disconnect() {
    if (typeof socket !== "undefined") {
        socket.close();
    }
}

function clearChat() {
    messageArea.innerHTML = "";
}

function chatboxReset() {
    connectionStatus.textContent = "Waiting for connection...";
    messageInputContainer.classList.add("loading");
    sendButton.setAttribute("disabled", "");
    disconnect();
    clearChat();
}

function disconnectButton() {
    disconnect();
    chatbox.classList.add("hidden");
}

function returnCurrentDate() {
    return Math.floor(Date.now() / 1000);
}

function sendMessage(message) {
    if (returnCurrentDate() - lastMessageDate < 2) {
        alert("Wait a couple seconds before sending next message.");
    } else if (message["content"].length > messageMaxLength) {
        alert("Your message is over " + messageMaxLength.toString() + " characters.");
    } else if (message["content"].length == 0) { } else {
        messageArea.innerHTML += `<p class="chatboxUserYou chatboxMessage">You</p><p class="chatboxMessage">: ${message["content"]}</p><br>`;
        socket.send(JSON.stringify(message));
        lastMessageDate = returnCurrentDate();
    }
}

function formatMessage(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

// QR Scanner
const qrScanner = document.getElementById("qrscanner");
const html5QrCode = new Html5Qrcode("qr-reader");
const qrreader_config = {
    fps: 10,
    qrbox: 300
}

function startQRScanner(_callback) {
    qrScanner.style.display = "block";
    html5QrCode.start({
        facingMode: "environment"
    }, qrreader_config, qrCodeMessage => {
        console.log(`QR Code detected: ${qrCodeMessage}`);
        stopQRScanner();
        _callback(qrCodeMessage);
    }).catch(err => {
        alert(`Unable to start scanning, error: ${err}`);
    });
}

function stopQRScanner() {
    html5QrCode.stop();
    qrScanner.style.display = "none";
}
