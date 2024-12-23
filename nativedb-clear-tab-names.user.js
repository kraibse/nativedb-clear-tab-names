// ==UserScript==
// @name         NativeDB Title Updater
// @namespace    https://github.com/kraibse/nativedb-clear-tab-names
// @version      1.0
// @description  Updates the browser tab title based on the page's NativeDB component title
// @author       kraibse
// @match        https://nativedb.red4ext.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const titleSelector = '.title>h1';
    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    // Function to update the document title
    function updateTitle() {
        const titleElement = document.querySelector(titleSelector);
        if (titleElement) {
            const newTitle = titleElement.textContent.trim();
            if (newTitle && document.title !== newTitle) {
                document.title = newTitle;
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        const shouldUpdate = mutations.some(mutation => {
            // Check if the mutation target is our title element or contains it
            return mutation.target.matches?.(titleSelector) ||
                   mutation.target.querySelector?.(titleSelector) ||
                   [...(mutation.addedNodes || [])].some(node =>
                       node.matches?.(titleSelector) || node.querySelector?.(titleSelector)
                   );
        });

        if (shouldUpdate) {
            updateTitle();
        }
    });

    function initializeObserver() {
        // First update the title immediately if the element exists
        updateTitle();

        // Then start observing for changes
        observer.observe(document.body, observerConfig);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeObserver();
    } else {
        document.addEventListener('DOMContentLoaded', initializeObserver);
    }
})();
