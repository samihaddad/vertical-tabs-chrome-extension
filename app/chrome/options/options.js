/**
 * Created by adrianlungu on 08/11/14.
 */

(function () {

  "use strict";

  var tab = document.querySelector('.tab');

  var tabSettings = {
    height: document.querySelector('#tabHeight'),
    fontSize: document.querySelector('#tabFontSize'),
  };

  var settings = {
    theme: document.querySelector('#theme'),
    openSide: document.querySelector('#tabOpenSide'),
    singleInstance: document.querySelector('#singleInstance'),
    autoAdjustWidth: document.querySelector('#autoAdjustWidth'),
    autoMinimize: document.querySelector('#autoMinimize')
  };

  var version = document.querySelector('#version');
  var save = document.querySelector('#save');
  var reset = document.querySelector('#reset');

  var tabFunctions = {
    mouseEnter: function () {
      tab.style.background = 'linear-gradient(' + tabSettings.hoverColor.top.value + ', '
        + tabSettings.hoverColor.bottom.value + ')';
    },
    mouseLeave: function () {
      tab.style.background = 'linear-gradient(' + tabSettings.backgroundColor.top.value + ', '
        + tabSettings.backgroundColor.bottom.value + ')';
    },
    mouseDown: function () {
      tab.style.background = tabSettings.highlightColor.value;
    }
  };

  function resetOptions() {
    chrome.storage.sync.remove(['tab', 'optionsSettings']);
    init();
  }

  function saveOptions() {
    chrome.storage.sync.set({
      tab: JSON.stringify({
        height: parseInt(tabSettings.height.value),
        fontSize: parseInt(tabSettings.fontSize.value),
      }),
      optionsSettings: JSON.stringify({
        theme: settings.theme.value,
        openSide: settings.openSide.value,
        singleInstance: settings.singleInstance.checked,
        autoAdjustWidth: settings.autoAdjustWidth.checked,
        autoMinimize: settings.autoMinimize.checked
      })

    }, function () {
      save.innerHTML = 'Options Saved!';

      setTimeout(function () {
        save.innerHTML = 'Save';
      }, 1000)
    }
    )
  }

  function getUserDefinedSettings() {
    chrome.storage.sync.get(['tab', 'optionsSettings'], function (items) {
      if (!items.tab) {
        items.tab = {
          height: 25,
          fontSize: 11,
        }
      } else {
        items.tab = JSON.parse(items.tab);
      }

      if (!items.optionsSettings) {
        items.settings = {
          theme: 'system',
          openSide: 'left',
          singleInstance: true,
          autoAdjustWidth: true,
          autoMinimize: true
        }
      } else {
        items.settings = JSON.parse(items.optionsSettings);
      }

      tabSettings.height.value = items.tab.height;
      tabSettings.fontSize.value = items.tab.fontSize;
      settings.theme.value = items.settings.theme || 'system';
      settings.openSide.value = items.settings.openSide;
      settings.singleInstance.checked = items.settings.singleInstance;
      settings.autoAdjustWidth.checked = items.settings.autoAdjustWidth;
      settings.autoMinimize.checked = items.settings.autoMinimize;

      setTabStyle();

    })

  }

  function setTabStyle() {

    tab.style.color = tabSettings.textColor.value;
    tab.style.background = 'linear-gradient(' + tabSettings.backgroundColor.top.value + ', '
      + tabSettings.backgroundColor.bottom.value + ')';
    tab.style.borderColor = tabSettings.borderColor.value;
    tab.style.height = tabSettings.height.value + 'px';
    tab.style.fontSize = tabSettings.fontSize.value + 'px';

  }

  function init() {

    getUserDefinedSettings();

    //version.innerHTML = 'Version ' + chrome.runtime.getManifest().version;

    save.addEventListener("click", saveOptions);
    reset.addEventListener("click", resetOptions);

    tabSettings.height.addEventListener("input", setTabStyle);
    tabSettings.fontSize.addEventListener("input", setTabStyle);

    tab.addEventListener('mouseenter', tabFunctions.mouseEnter);
    tab.addEventListener('mouseleave', tabFunctions.mouseLeave);

    tab.addEventListener('mousedown', tabFunctions.mouseDown);
    tab.addEventListener('mouseup', tabFunctions.mouseEnter);
  }

  init();

})();
