console.log("background.js loaded");


const scriptURLs = [
  "scripts/1_1_1_NonTextContent(A).js",
  "scripts/1_3_1_InfoAndRelationships(A).js",
  "scripts/1_3_5_Identify_Input_Purpose(AA).js",
  "scripts/1_3_6_Identify_Purpose(AAA).js",
  "scripts/1_4_1_UseOfColor(A).js",
  "scripts/1_4_3_Contrast(Minimum)(AA).js",
  "scripts/1_4_4_ResizeText(AA).js",
  "scripts/1_4_6_Contrast(Enhanced)(AAA).js",
  "scripts/2_1_1_Keyboard(A).js",
  "scripts/2_2_2_Pause,Stop,Hide(A).js",
  "scripts/2_4_4_LinkPurpose(A).js",
  "scripts/2_4_6_HeadingsAndLabels(AA).js",
  "scripts/2_4_11_FocusAppearanceMinimum(AA).js",
  "scripts/2_4_12_FocusAppearanceEnhanced(AAA).js",
  "scripts/2_5_7_Dragging(AA).js",
  "scripts/2_5_8_Target Size_(Minimum)(AA).js",
  "scripts/3_1_1_LanguageOfPage(A).js",
  "scripts/3_2_7_HiddenControls(AA).js",
  "scripts/3_3_2_LabelsOrInstructions(A).js",
  "scripts/3_3_7_AccessibleAuthentication(A).js",
  "scripts/4_1_1_Parsing(A).js",
  "scripts/4_1_2_NameRoleValue.js",
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab has finished loading
  if (changeInfo.status === "complete" && tab.url) {
    // Execute scripts in the tab
    executeScriptsInTab(tabId);
  }
});

function executeScriptsInTab(tabId) {
  scriptURLs.forEach((scriptURL) => {
    console.log(`Executing script ${scriptURL}`);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [scriptURL],
    });
  });
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "results") {
    // console.log('%c$12345 TEXT BLOCK ', ruleStyle, errorStyle);
    const errors = message.data.errors;
    const fixed = message.data.fixed;
    const script = message.script;
    const tabId = sender.tab.id;

    // Retrieve existing data for the tab from storage
    chrome.storage.local.get(tabId.toString(), function(result) {
      const existingData = result[tabId.toString()] || {};

      // Update data with new errors and fixed counts for the script
      existingData[script] = { errors, fixed };

      // Store updated data in storage
      chrome.storage.local.set({ [tabId]: existingData });
    });
  }
  if (message.type === "textBlockInfo") {
      const textBlocksHTML = message.textBlocks;
      textBlocksHTML.forEach(html => {
          const block = $(html); // Convert HTML string to jQuery object
          // const container = $('<div class="text-block-container"></div>'); // Create a container for the text block
          const plusBtn = $('<button class="plus-btn">+</button>'); // Create the plus button
          plusBtn.css({
              'margin-left': '5px',
              'cursor': 'pointer',
              'background-color': '#4CAF50',
              'color': 'white',
              'border': 'none',
              'border-radius': '50%',
              'width': '25px',
              'height': '25px',
              'font-size': '16px',
          });
          block.after(plusBtn); // Insert the plus button after the text block
          let clickCnt = 0;
          plusBtn.click(function() {
              if (clickCnt >= 5) {
                  $('.plus-btn').off('click');
              } else {
                  const currentSize = parseFloat(block.css('font-size'));
                  if (block.css('font-size').includes('px')) {
                      block.css('font-size', `${currentSize * 1.002}px`);
                      clickCnt++;
                  } 
              }
          });
      });
  }

});


async function caption_query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
		{
			headers: { Authorization: "Bearer " + apiKey },
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

async function title_query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/fabiochiu/t5-base-medium-title-generation",
		{
			headers: { Authorization: "Bearer " + apiKey },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

var langMap2 = {
  "aar" : true, "abk" : true, "ace" : true, "ach" : true, "ada" : true, "ady" : true, "afa" : true, "afh" : true,
  "afr" : true, "ain" : true, "aka" : true, "akk" : true, "alb" : true, "sqi" : true, "ale" : true, "alg" : true,
  "alt" : true, "amh" : true, "ang" : true, "anp" : true,
  "apa" : true,
  "ara" : true,
  "arc" : true,
  "arg" : true,
  "arm" : true,
  "hye" : true,
  "arn" : true,
  "arp" : true,
  "art" : true,
  "arw" : true,
  "asm" : true,
  "ast" : true,
  "ath" : true,
  "aus" : true,
  "ava" : true,
  "ave" : true,
  "awa" : true,
  "aym" : true,
  "aze" : true,
  "bad" : true,
  "bai" : true,
  "bak" : true,
  "bal" : true,
  "bam" : true,
  "ban" : true,
  "baq" : true,
  "eus" : true,
  "bas" : true,
  "bat" : true,
  "bej" : true,
  "bel" : true,
  "bem" : true,
  "ben" : true,
  "ber" : true,
  "bho" : true,
  "bih" : true,
  "bik" : true,
  "bin" : true,
  "bis" : true,
  "bla" : true,
  "bnt" : true,
  "tib" : true,
  "bod" : true,
  "bos" : true,
  "bra" : true,
  "bre" : true,
  "btk" : true,
  "bua" : true,
  "bug" : true,
  "bul" : true,
  "bur" : true,
  "mya" : true,
  "byn" : true,
  "cad" : true,
  "cai" : true,
  "car" : true,
  "cat" : true,
  "cau" : true,
  "ceb" : true,
  "cel" : true,
  "cze" : true,
  "ces" : true,
  "cha" : true,
  "chb" : true,
  "che" : true,
  "chg" : true,
  "chi" : true,
  "zho" : true,
  "chk" : true,
  "chm" : true,
  "chn" : true,
  "cho" : true,
  "chp" : true,
  "chr" : true,
  "chu" : true,
  "chv" : true,
  "chy" : true,
  "cmc" : true,
  "cnr" : true,
  "cop" : true,
  "cor" : true,
  "cos" : true,
  "cpe" : true,
  "cpf" : true,
  "cpp" : true,
  "cre" : true,
  "crh" : true,
  "crp" : true,
  "csb" : true,
  "cus" : true,
  "wel" : true,
  "cym" : true,
  "cze" : true,
  "ces" : true,
  "dak" : true,
  "dan" : true,
  "dar" : true,
  "day" : true,
  "del" : true,
  "den" : true,
  "ger" : true,
  "deu" : true,
  "dgr" : true,
  "din" : true,
  "div" : true,
  "doi" : true,
  "dra" : true,
  "dsb" : true,
  "dua" : true,
  "dum" : true,
  "dut" : true,
  "nld" : true,
  "dyu" : true,
  "dzo" : true,
  "efi" : true,
  "egy" : true,
  "eka" : true,
  "gre" : true,
  "ell" : true,
  "elx" : true,
  "eng" : true,
  "enm" : true,
  "epo" : true,
  "est" : true,
  "baq" : true,
  "eus" : true,
  "ewe" : true,
  "ewo" : true,
  "fan" : true,
  "fao" : true,
  "per" : true,
  "fas" : true,
  "fat" : true,
  "fij" : true,
  "fil" : true,
  "fin" : true,
  "fiu" : true,
  "fon" : true,
  "fre" : true,
  "fra" : true,
  "fre" : true,
  "fra" : true,
  "frm" : true,
  "fro" : true,
  "frr" : true,
  "frs" : true,
  "fry" : true,
  "ful" : true,
  "fur" : true,
  "gaa" : true,
  "gay" : true,
  "gba" : true,
  "gem" : true,
  "geo" : true,
  "kat" : true,
  "ger" : true,
  "deu" : true,
  "gez" : true,
  "gil" : true,
  "gla" : true,
  "gle" : true,
  "glg" : true,
  "glv" : true,
  "gmh" : true,
  "goh" : true,
  "gon" : true,
  "gor" : true,
  "got" : true,
  "grb" : true,
  "grc" : true,
  "gre" : true,
  "ell" : true,
  "grn" : true,
  "gsw" : true,
  "guj" : true,
  "gwi" : true,
  "hai" : true,
  "hat" : true,
  "hau" : true,
  "haw" : true,
  "heb" : true,
  "her" : true,
  "hil" : true,
  "him" : true,
  "hin" : true,
  "hit" : true,
  "hmn" : true,
  "hmo" : true,
  "hrv" : true,
  "hsb" : true,
  "hun" : true,
  "hup" : true,
  "arm" : true,
  "hye" : true,
  "iba" : true,
  "ibo" : true,
  "ice" : true,
  "isl" : true,
  "ido" : true,
  "iii" : true,
  "ijo" : true,
  "iku" : true,
  "ile" : true,
  "ilo" : true,
  "ina" : true,
  "inc" : true,
  "ind" : true,
  "ine" : true,
  "inh" : true,
  "ipk" : true,
  "ira" : true,
  "iro" : true,
  "ice" : true,
  "isl" : true,
  "ita" : true,
  "jav" : true,
  "jbo" : true,
  "jpn" : true,
  "jpr" : true,
  "jrb" : true,
  "kaa" : true,
  "kab" : true,
  "kac" : true,
  "kal" : true,
  "kam" : true,
  "kan" : true,
  "kar" : true,
  "kas" : true,
  "geo" : true,
  "kat" : true,
  "kau" : true,
  "kaw" : true,
  "kaz" : true,
  "kbd" : true,
  "kha" : true,
  "khi" : true,
  "khm" : true,
  "kho" : true,
  "kik" : true,
  "kin" : true,
  "kir" : true,
  "kmb" : true,
  "kok" : true,
  "kom" : true,
  "kon" : true,
  "kor" : true,
  "kos" : true,
  "kpe" : true,
  "krc" : true,
  "krl" : true,
  "kro" : true,
  "kru" : true,
  "kua" : true,
  "kum" : true,
  "kur" : true,
  "kut" : true,
  "lad" : true,
  "lah" : true,
  "lam" : true,
  "lao" : true,
  "lat" : true,
  "lav" : true,
  "lez" : true,
  "lim" : true,
  "lin" : true,
  "lit" : true,
  "lol" : true,
  "loz" : true,
  "ltz" : true,
  "lua" : true,
  "lub" : true,
  "lug" : true,
  "lui" : true,
  "lun" : true,
  "luo" : true,
  "lus" : true,
  "mac" : true,
  "mkd" : true,
  "mad" : true,
  "mag" : true,
  "mah" : true,
  "mai" : true,
  "mak" : true,
  "mal" : true,
  "man" : true,
  "mao" : true,
  "mri" : true,
  "map" : true,
  "mar" : true,
  "mas" : true,
  "may" : true,
  "msa" : true,
  "mdf" : true,
  "mdr" : true,
  "men" : true,
  "mga" : true,
  "mic" : true,
  "min" : true,
  "mis" : true,
  "mac" : true,
  "mkd" : true,
  "mkh" : true,
  "mlg" : true,
  "mlt" : true,
  "mnc" : true,
  "mni" : true,
  "mno" : true,
  "moh" : true,
  "mon" : true,
  "mos" : true,
  "mao" : true,
  "mri" : true,
  "may" : true,
  "msa" : true,
  "mul" : true,
  "mun" : true,
  "mus" : true,
  "mwl" : true,
  "mwr" : true,
  "bur" : true,
  "mya" : true,
  "myn" : true,
  "myv" : true,
  "nah" : true,
  "nai" : true,
  "nap" : true,
  "nau" : true,
  "nav" : true,
  "nbl" : true,
  "nde" : true,
  "ndo" : true,
  "nds" : true,
  "nep" : true,
  "new" : true,
  "nia" : true,
  "nic" : true,
  "niu" : true,
  "dut" : true,
  "nld" : true,
  "nno" : true,
  "nob" : true,
  "nog" : true,
  "non" : true,
  "nor" : true,
  "nqo" : true,
  "nso" : true,
  "nub" : true,
  "nwc" : true,
  "nya" : true,
  "nym" : true,
  "nyn" : true,
  "nyo" : true,
  "nzi" : true,
  "oci" : true,
  "oji" : true,
  "ori" : true,
  "orm" : true,
  "osa" : true,
  "oss" : true,
  "ota" : true,
  "oto" : true,
  "paa" : true,
  "pag" : true,
  "pal" : true,
  "pam" : true,
  "pan" : true,
  "pap" : true,
  "pau" : true,
  "peo" : true,
  "per" : true,
  "fas" : true,
  "phi" : true,
  "phn" : true,
  "pli" : true,
  "pol" : true,
  "pon" : true,
  "por" : true,
  "pra" : true,
  "pro" : true,
  "pus" : true,
  "qaa-qtz" : true,
  "que" : true,
  "raj" : true,
  "rap" : true,
  "rar" : true,
  "roa" : true,
  "roh" : true,
  "rom" : true,
  "rum" : true,
  "ron" : true,
  "rum" : true,
  "ron" : true,
  "run" : true,
  "rup" : true,
  "rus" : true,
  "sad" : true,
  "sag" : true,
  "sah" : true,
  "sai" : true,
  "sal" : true,
  "sam" : true,
  "san" : true,
  "sas" : true,
  "sat" : true,
  "scn" : true,
  "sco" : true,
  "sel" : true,
  "sem" : true,
  "sga" : true,
  "sgn" : true,
  "shn" : true,
  "sid" : true,
  "sin" : true,
  "sio" : true,
  "sit" : true,
  "sla" : true,
  "slo" : true,
  "slk" : true,
  "slo" : true,
  "slk" : true,
  "slv" : true,
  "sma" : true,
  "sme" : true,
  "smi" : true,
  "smj" : true,
  "smn" : true,
  "smo" : true,
  "sms" : true,
  "sna" : true,
  "snd" : true,
  "snk" : true,
  "sog" : true,
  "som" : true,
  "son" : true,
  "sot" : true,
  "spa" : true,
  "alb" : true,
  "sqi" : true,
  "srd" : true,
  "srn" : true,
  "srp" : true,
  "srr" : true,
  "ssa" : true,
  "ssw" : true,
  "suk" : true,
  "sun" : true,
  "sus" : true,
  "sux" : true,
  "swa" : true,
  "swe" : true,
  "syc" : true,
  "syr" : true,
  "tah" : true,
  "tai" : true,
  "tam" : true,
  "tat" : true,
  "tel" : true,
  "tem" : true,
  "ter" : true,
  "tet" : true,
  "tgk" : true,
  "tgl" : true,
  "tha" : true,
  "tib" : true,
  "bod" : true,
  "tig" : true,
  "tir" : true,
  "tiv" : true,
  "tkl" : true,
  "tlh" : true,
  "tli" : true,
  "tmh" : true,
  "tog" : true,
  "ton" : true,
  "tpi" : true,
  "tsi" : true,
  "tsn" : true,
  "tso" : true,
  "tuk" : true,
  "tum" : true,
  "tup" : true,
  "tur" : true,
  "tut" : true,
  "tvl" : true,
  "twi" : true,
  "tyv" : true,
  "udm" : true,
  "uga" : true,
  "uig" : true,
  "ukr" : true,
  "umb" : true,
  "und" : true,
  "urd" : true,
  "uzb" : true,
  "vai" : true,
  "ven" : true,
  "vie" : true,
  "vol" : true,
  "vot" : true,
  "wak" : true,
  "wal" : true,
  "war" : true,
  "was" : true,
  "wel" : true,
  "cym" : true,
  "wen" : true,
  "wln" : true,
  "wol" : true,
  "xal" : true,
  "xho" : true,
  "yao" : true,
  "yap" : true,
  "yid" : true,
  "yor" : true,
  "ypk" : true,
  "zap" : true,
  "zbl" : true,
  "zen" : true,
  "zgh" : true,
  "zha" : true,
  "chi" : true,
  "zho" : true,
  "znd" : true,
  "zul" : true,
  "zun" : true,
  "zxx" : true,
  "zza" : true}