let container;
let words = [];
let displayBox;

let textBox;
let initialText;
let submitButton;

const EOL = "¬";
const RHYME_DIST = 0; // How many syllables "rhyming" words are allowed to differ by.
const SIMILARITY_DIST = 3; // How far apart two "similar" words are allowed to be.

function preload() {
  loadJSON("newwords.json", data => {
    newwordsJSON = data;
  })

  loadStrings("initial.txt", strings => {
    initialText = strings.join("\n");
  });
}

function setup() {
  noCanvas();
  teachProperNouns();

  textBox = select("#txtArea");
  submitButton = select("#submitButton");
  submitButton.mousePressed(refreshText);

  container = select("#container");
  displayBox = select("#displayBox");

  textBox.value(initialText);
  refreshText();
}

function refreshText() {
  let text = textBox.value();
  text = text.replace(/\n/g, ` ${EOL} `);

  let riText = new RiString(text);
  let features = riText.analyze().features();

  words.forEach(word => {
    word.remove();
  });

  words = features.tokens.split(" ").map((token, i) => {
    let pos = riText.posAt(i);
    return new Word(token, pos, container);
  });
}
