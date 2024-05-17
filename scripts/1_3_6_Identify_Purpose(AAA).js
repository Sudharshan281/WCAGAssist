setTimeout(() => {
    IdentifyPurpose()
}, 4000);

function IdentifyPurpose() {
    let errors = 0;
    let fixed = 0;
    $.fn.log = function () {
        console.log.apply(console, this);
        return this;
    };
    $(document).ready(function () {
        $('*').each(function () {
            if ($(this).prop("nodeName") == "SECTION" ||
                $(this).prop("nodeName") == "FORM" ||
                $(this).prop("nodeName") == "NAV" ||
                $(this).prop("nodeName") == "MAIN") {
                var checkRoleAttr = $(this).attr('role');
                if (checkRoleAttr == undefined || checkRoleAttr == false || checkRoleAttr == null) {
                    errors++;
                    window.errorMessage("WCAG 1.3.6 (2.1,AAA)", "Using ARIA landmarks to identify regions of a page is Missing", "Add role='PURPOSE'", $(this));

                    // Fix: Add role attribute
                    $(this).attr('role', 'PURPOSE');

                    fixed++;
                    
                }
            }
        })
    })

    chrome.runtime.sendMessage({ type: "results", script: "1_3_6_Identify_Purpose(AAA)", data: { errors, fixed } });

}