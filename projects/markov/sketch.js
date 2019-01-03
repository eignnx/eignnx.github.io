document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

function sketch(p) {
  p.setup = () => {
    p.noCanvas();

    p.textBox = p.select("#textarea1");
    p.submitBtn = p.select("#submitBtn");
    p.outputP = p.select("#outputP");
    p.nSelect = p.select("#nGramSize");
    p.generatedTextSize = p.select("#generatedTextSize");

    p.submitBtn.mousePressed(() => {
      let inputText = "\n" + p.textBox.value();
      let n = Number(p.nSelect.value());
      let mc = new MarkovChain(inputText, n);

      let textSize = Number(p.generatedTextSize.value());
      let outputText = mc.generate(textSize);
      p.outputP.html(outputText.replace(/\n/g, "<br/>"));
    });
  }
}

let mySketch = new p5(sketch);

class ProbSet {
  constructor() {
    this.map = {};
    this.total = 0;
  }

  add(key) {
    if (!this.map.hasOwnProperty(key)) {
      this.map[key] = 1;
    } else {
      this.map[key]++;
    }
    this.total++;
  }

  randomElement() {
    let r = Math.random() * this.total;
    for (let key in this.map) {
      let count = this.map[key];
      r -= count;
      if (r <= 0) {
        return key;
      }
    }
    throw "UNREACHABLE!";
  }
}

class MarkovChain {
  constructor(sourceText, n) {
    this.n = n || 1;
    this.nGrams = {};
    this.build(sourceText);
  }

  build(sourceText) {
    let cursor1 = 0;
    let cursor2 = this.n;

    while (cursor2 < sourceText.length) {
      const curr = sourceText.slice(cursor1, cursor1 + this.n);
      const next = sourceText.charAt(cursor2);
      this.insertPair(curr, next);
      cursor1++;
      cursor2++;
    }
  }

  randomStartingNGram() {
    const possibilities =
      Object.keys(this.nGrams)
            .filter(key => key.startsWith("\n"));

    return randomElement(possibilities);
  }

  insertPair(currNGram, nextNGram) {
    if (!this.nGrams.hasOwnProperty(currNGram)) {
      this.nGrams[currNGram] = new ProbSet();
    }
    this.nGrams[currNGram].add(nextNGram);
  }

  generate(textLength) {
    let outputText = this.randomStartingNGram();

    while (outputText.length < textLength) {
      // Get last `n` chars.
      const curr = outputText.slice(-this.n);
      if (!this.nGrams.hasOwnProperty(curr)) {
        console.log("HAD TO RESTART");
        outputText += `<span style="color: red">|</span>`;
        outputText += this.randomStartingNGram();
        continue;
      }
      const next = this.nGrams[curr].randomElement();
      outputText += next;
    }
    return outputText;
  }
}

function randomElement(seq) {
  return seq[Math.floor(Math.random() * seq.length)];
}