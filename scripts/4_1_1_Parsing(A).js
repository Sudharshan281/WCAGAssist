setTimeout(() => {
    Parsing()   
}, 22000);

function Parsing() {
    let errors = 0;
    let fixed = 0;
    $.fn.log = function () {
        console.log.apply(console, this);
        return this;
    };
    if (document.doctype === null){
        errors++;
        window.errorMessage("WCAG 4.1.1 (2.0,A)", "Doctype is missing.", "Add <!DOCTYPE html>", document.documentElement);

        // Fix: Add <!DOCTYPE html>
        var doctype = document.implementation.createDocumentType('html', '', '');
        document.insertBefore(doctype, document.childNodes[0]);

        fixed++;

    }
    var allTags = document.querySelectorAll('*')
    var id_map = {}
    for (var d = 0; d < allTags.length; d++) {
        if (allTags[d].nodeName != "HTML" &&
            allTags[d].nodeName != "BASE" &&
            allTags[d].nodeName != "TITLE" &&
            allTags[d].nodeName != "SCRIPT" &&
            allTags[d].nodeName != "STYLE"  &&
            allTags[d].nodeName != "HEAD" &&
            allTags[d].nodeName != "META") {
            if (allTags[d].id != null && allTags[d].id != "") {
                if (allTags[d].id in id_map) {
                    id_map[allTags[d].id].push(d)
                } else {
                    var new_arr = []
                    new_arr.push(d)
                    id_map[allTags[d].id] = new_arr
                }
            }
        }
    }
    for (id in id_map) {
        if (id_map[id].length > 1) {
            errors++;
            window.errorMessage("WCAG 4.1.1 (2.0,A)", "Found two or more elements using same id", "Use a distinct id value", allTags[id_map[id][0]]);
                                
            // Fix: Change the id value
            for (var i = 1; i < id_map[id].length; i++) {
                allTags[id_map[id][i]].id = id + i
            }
            fixed++;
            
        }
    }   

    chrome.runtime.sendMessage({ type: "results", script: "4_1_1_Parsing(A)", data: { errors, fixed } });  
}