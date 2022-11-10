
const connectButton = document.getElementById ('connect-button');
let val = document.getElementById ('current-value');
let port;
let lineBuffer = '';
let latestValue = 0;

function update(){
  val.innerText = latestValue;
  // console.log(latestValue);
}
window.setInterval(update, 100);

if ('serial' in navigator) {
  connectButton.addEventListener('click', function () {
    if (port) {
      port.close();
      port = undefined;

      connectButton.innerText = 'Connect';
    }
    else {
      getReader();
    }
  });

  connectButton.disabled = false;
}

async function getReader() {
  port = await navigator.serial.requestPort({});
  await port.open({ baudRate: 9600 });

  connectButton.innerText = 'Disconnect';

  const appendStream = new WritableStream({
    write(chunk) {
      lineBuffer += chunk;

      let lines = lineBuffer.split('\n');

      if (lines.length > 1) {
        lineBuffer = lines.pop();
        latestValue = parseInt(lines.pop().trim());
      }
    }
  });

  port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeTo(appendStream);
}