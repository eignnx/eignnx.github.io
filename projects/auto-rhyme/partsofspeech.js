let newwordsJSON;
let partsOfSpeech;

function readablePos(tag) {
  return partsOfSpeech[tag] || tag;
}

function teachProperNouns() {
    partsOfSpeech = newwordsJSON.partsOfSpeech;
    newwordsJSON.newWords.forEach(([word, pronunciation, pos]) => {
        RiTa.addWord(word, pronunciation, pos);
    });
}
