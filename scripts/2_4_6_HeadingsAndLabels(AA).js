setTimeout(() => {
    HeadingsAndLabels();
}, 13000);

function HeadingsAndLabels() {
    let errors = 0;
    let fixed = 0;
    
    $.fn.log = function () {
        console.log.apply(console, this);
        return this;
    };

    var headerList = [];
    $('*').each(function () {
        if ($(this).prop("nodeName").match(/^H[1-6]$/)) {
            headerList.push($(this));
        }
    });

    // defined currentHeader and nextHeader
    for (let index = 0; index < headerList.length - 1; index++) {
        let currentHeader = headerList[index];
        let nextHeader = headerList[index + 1];

        let currentLevel = parseInt(currentHeader.prop("nodeName").replace("H", ""));
        let nextLevel = parseInt(nextHeader.prop("nodeName").replace("H", ""));
        let expectedNextLevel = currentLevel + 1;

        if (nextLevel > expectedNextLevel) {
            errors++;
            window.errorMessage("WCAG 2.4.6 (2.0,AA)", "Header nesting is incorrect", "Modify the header nesting so that H" + expectedNextLevel + " follows the current " + currentHeader.prop("nodeName") + " tag", currentHeader);

            // Fix: Modify the header nesting
            nextHeader.replaceWith("<" + "H" + expectedNextLevel + ">" + nextHeader.html() + "</" + "H" + expectedNextLevel + ">");
            fixed++;
        }
    }

    chrome.runtime.sendMessage({ type: "results", script: "2_4_6_HeadingsAndLabels(AA)", data: { errors, fixed } });
}
