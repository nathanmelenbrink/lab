const connectButton = document.getElementById ('connect-button');
let port;

if ('serial' in navigator) {
  connectButton.addEventListener('click', function () {
    if (port) {
      port.close();
      port = undefined;

      connectButton.innerText = '🔌 Connect';
      document.querySelector('figure').classList.replace('bounceIn', 'fadeOut');
    }
    else {
      getReader();
    }
  });

  connectButton.disabled = false;
}
else {
  const firstBubble = document.querySelector('p.bubble');
  const noSerialSupportNotice = document.createElement('p');
  noSerialSupportNotice.innerHTML = '<p class="notice bubble">You\'re on the right track! This browser is lacking support for Web Serial API, though, and thats a bummer.</p>';

  firstBubble.parentNode.insertBefore(noSerialSupportNotice, firstBubble.nextSibling);
}

let lineBuffer = '';
let latestValue = 0;

// function renderDemo() {
//   const rabbit = document.querySelector('.rabbit');
//   const percentage = Math.floor(latestValue / 1023 * 100);
//   const percentageStatus = document.querySelector('figcaption span');

//   rabbit.style.left = 'calc(' + percentage + '% - 2em)';
//   percentageStatus.innerText = percentage;

//   window.requestAnimationFrame(renderDemo);
// }
// window.requestAnimationFrame(renderDemo);

async function getReader() {
  port = await navigator.serial.requestPort({});
  await port.open({ baudRate: 9600 });

  connectButton.innerText = '🔌 Disconnect';
  document.querySelector('figure').classList.remove('fadeOut');
  document.querySelector('figure').classList.add('bounceIn');

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