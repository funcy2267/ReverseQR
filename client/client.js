const uniqueCodeLength = 12;

// handle URL parameters
function getUrlParam(searchString, param) {
    const urlParams = new URLSearchParams(searchString);
    return urlParams.get(param);
}

const URLClientMode = getUrlParam(window.location.search, "client");
const URLConnectCode = getUrlParam(window.location.search, "code");


if (URLClientMode != null) {
    selectClientMode(parseInt(URLClientMode));
} else {
    backToClientSelect();
}
if (URLConnectCode != null) {
    connect2(URLConnectCode);
}

// client 1
const client1 = document.getElementById("client1");
const connectionInfo1 = document.getElementById("connectionInfo1");
const deviceCode1 = document.getElementById("deviceCode1");
const connectLink1 = document.getElementById("connectLink1");
const qrcode1 = document.getElementById("qrcode1");
const generateQRCodeButton1 = document.getElementById("generateQRCodeButton1");

function generateCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function generateQRCode1() {
    connectionInfo1.classList.remove("hidden");
    chatbox.classList.remove("hidden");
    deviceCode1.innerHTML, qrcode1.innerHTML = "";
    const uniqueCode1 = generateCode(uniqueCodeLength);
    const URLConnect = window.location.href.split('?')[0] + '?client=2&code=' + uniqueCode1;
    deviceCode1.textContent = uniqueCode1;
    connectLink1.href = connectLink1.textContent = URLConnect;
    new QRCode(qrcode1, URLConnect);
    $("#chatbox").appendTo("#client1");
    connect(uniqueCode1);
}

//client 2
const client2 = document.getElementById("client2");
const otherDeviceCodeInput2 = document.getElementById("otherDeviceCodeInput2");
const connectButton2 = document.getElementById("connectButton2");

function connect2(uniqueCode2) {
    if (uniqueCode2.length == 0) {
        alert("Enter connection code first.");
    } else if (uniqueCode2.length != uniqueCodeLength) {
        alert("Wrong connection code length.");
    } else {
        chatbox.classList.remove("hidden");
        $("#chatbox").appendTo("#client2");
        connect(uniqueCode2);
    }
}

function scanQR2() {
    $("#qrscanner").appendTo("#client2");
    let uniqueCode2;
    startQRScanner((qrResult2) => {
        uniqueCode2 = getUrlParam(qrResult2.split('?')[1], "code");
        console.log(uniqueCode2);
        connect2(uniqueCode2);
    });
}

//client 3
const client3 = document.getElementById("client3");
const pairStatus3 = document.getElementById("pairStatus3");
uniqueCodes3 = [];

function pairDevices() {
    sendMessage({ type: "connectionData", content: uniqueCodes3 });
    pairStatus3.textContent = "Paired!";
}

function pairDevicesHandle(message) {
    disconnect();
    connect(message["content"][0]);
}

function scanQR3(id) {
    $("#qrscanner").appendTo("#client3");
    startQRScanner((qrResult3) => {
        uniqueCodes3[id] = getUrlParam(qrResult3.split('?')[1], "code");
        console.log(uniqueCodes3[id]);
        if (id == 1) {
            connect(uniqueCodes3[id]);
        }
    });
}
