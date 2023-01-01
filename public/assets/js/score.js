function sendScore(score) {
  sendEventToParent('gameScore', { score });
}

function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

bindEvent(window, 'message', function (e) {
  if (e.data && e.data.action === 'eventName') {
    console.log('Child listening..');
  }
});

function sendEventToParent(eventName, data) {
  const event = {
    action: eventName,
    data
  };
  window.parent.postMessage(event, '*');
}
