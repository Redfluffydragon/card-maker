/**
 * For images from url - add url validator?
 * Image options:
  * size
  * rotation
  * border?
 * Lists?
 * probably just asterisk - hyphen might be used with spaces around
 * different styles in settings?
 * border for each list element?
 * when hit swap button, recalculate page breaks
 * open on last used preset? and make settings starting size not overlap the page
 */
'use strict';

const cardInput = document.getElementById('cardInput');

const pageForm = document.getElementById('pageForm');
const pageMarginInput = document.getElementById('pageMargin');
const pageWidthInput = document.getElementById('pageWidth');
const pageHeightInput = document.getElementById('pageHeight');

const cardForm = document.getElementById('cardForm');
const cardHeightInput = document.getElementById('cardHeight');
const cardWidthInput = document.getElementById('cardWidth');
const showCardWidth = document.getElementById('showCardWidth');
const showCardHeight = document.getElementById('showCardHeight');
const cardColsInput = document.getElementById('cardCols');
const cardRowsInput = document.getElementById('cardRows');
const cardGap = document.getElementById('cardGap');
const cardBorderWidth = document.getElementById('cardBorderWidth');
const cardBorderColor = document.getElementById('cardBorderColor');
const noPrintBorderCheck = document.getElementById('noPrintBorderCheck');
const cardBorderRadius = document.getElementById('cardBorderRadius');
const cryptidCheck = document.getElementById('cryptidCheck');

const textForm = document.getElementById('textForm');
const textInset = document.getElementById('textInset');
const fontSize = document.getElementById('fontSize');
const boldCheck = document.getElementById('boldCheck');
const italicCheck = document.getElementById('italicCheck');
const underlineCheck = document.getElementById('underlineCheck');
const justifySelect = document.getElementById('justifySelect');
const vertAlignSelect = document.getElementById('vertAlignSelect');
const lineSpacing = document.getElementById('lineSpacing');
const fontSelect = document.getElementById('fontSelect');
const textColor = document.getElementById('textColor');
const textRotation = document.getElementById('textRotation');
const showTextRotation = document.getElementById('showTextRotation');
const textX = document.getElementById('textX');
const showTextX = document.getElementById('showTextX');
const textY = document.getElementById('textY');
const showTextY = document.getElementById('showTextY');

const presetSelect = document.getElementById('presetSelect');
const presetOptions = presetSelect.getElementsByTagName('option');
const newPresetForm = document.getElementById('newPresetForm');
const newPresetName = document.getElementById('newPresetName');
const editPresetForm = document.getElementById('editPresetForm');
const editPresetName = document.getElementById('editPresetName');
const confirmDeleteForm = document.getElementById('confirmDeleteForm');
const sameNameWarn = document.getElementById('sameNameWarn');
const noDeleteWarn = document.getElementById('noDeleteWarn');

const pagesDiv = document.getElementById('pages');

let saveCards = JSON.parse(localStorage.getItem('cards')) || '';
let currentPreset = 0;

const presets = JSON.parse(localStorage.getItem('presets')) || [{
    name: 'Default',
    width: 8.5,
    height: 11,
    cols: 3,
    rows: 3,
    cardWidth: 2.75,
    cardHeight: 3.58,
    gap: 0,
    borderWidth: 1,
    borderColor: '#000',
    printBorders: true,
    radius: 0.3125,
    inset: 0.25,
    fontSize: 12,
    bold: false,
    italic: false,
    underline: false,
    justify: 'left',
    align: 'flex-start',
    spacing: 1.15,
    font: 'sans-serif',
    textColor: '#000',
    rotation: 0,
    x: 0,
    y: 0,
  }];

/**Generate cards from input*/
const makeCards = (cardsText = cardInput.value.split(/\\(\n)*/).filter(i => /\S/.test(i))) => {
  if (cardInput.value === '') {
    return;
  }
  saveCards = cardInput.value;
  pagesDiv.innerHTML = '';
  const pageSize = 
    Math.floor((pageWidthInput.value - (2 * pageMarginInput.value)) / cardWidthInput.value) *
    Math.floor((pageHeightInput.value - (2 * pageMarginInput.value)) / cardHeightInput.value);
  const pages = [document.createElement('div')];
  if (cryptidCheck.checked) {
    for (let [idx, item] of cardsText.entries()) {
      const pageNum = Math.trunc(idx / pageSize);
      if (pageNum > pages.length - 1) {
        pages.push(document.createElement('div'));
      }
      const newCard = document.createElement('div');
      newCard.classList.add('card');
      const text = document.createElement('div');
      let justText = item == null ? '' : item.split('	');

      const name = document.createElement('span');
      name.textContent = justText[0];
      name.classList.add('cryptidName');
      text.appendChild(name);

      const territory = document.createElement('span');
      if (!justText[3].includes('Starter')) {
        territory.textContent = 'Region ' + justText[3];
      }
      else {
        territory.textContent = 'Starter';
      }
      territory.classList.add('cryptidTerritory');
      text.appendChild(territory);

      const type = document.createElement('span');
      type.textContent = justText[8];
      type.classList.add('cryptidType');
      text.appendChild(type);

      const stats = document.createElement('div');
      stats.classList.add('cryptidStats');

      const health = document.createElement('span');
      health.innerHTML = `Health: <strong>${justText[4]}</strong>`;
      health.classList.add('cryptidHealth');
      stats.appendChild(health);

      const attack = document.createElement('span');
      attack.innerHTML = `Attack: <strong>${justText[5]}</strong>`;
      attack.classList.add('cryptidAttack');
      stats.appendChild(attack);
      
      stats.appendChild(document.createElement('br'));

      const speed = document.createElement('span');
      speed.innerHTML = `Speed: <strong>${justText[6]}</strong>`;
      speed.classList.add('cryptidSpeed');
      stats.appendChild(speed);

      const points = document.createElement('span');
      points.innerHTML = `Points: <strong>${justText[7]}</strong>`;
      points.classList.add('cryptidPoints');
      stats.appendChild(points);

      const image = document.createElement('div');
      image.classList.add('cryptidImage');
      image.src = justText[10];
      text.appendChild(image);

      const abilities = document.createElement('div');
      abilities.classList.add('cryptidAbilities');

      const ability1 = document.createElement('span');
      ability1.textContent = justText[9];
      abilities.appendChild(ability1);

      if (!justText[3].includes('Starter')) {
        const ability2 = document.createElement('span');
        ability2.innerHTML = '<strong>12:</strong> ' + justText[10];
        abilities.appendChild(ability2);

        if (justText[9] != null) {
          const ability3 = document.createElement('span');
          ability3.innerHTML = '<strong>10:</strong> ' + justText[11].replace('X', 10);
          abilities.appendChild(ability3);
        }
      }
      
      text.appendChild(stats);
      text.appendChild(abilities);
      text.classList.add('cardText');
      newCard.appendChild(text);
      pages[pageNum].appendChild(newCard);
    }
  }
  else if (document.getElementById('bonusCheck').checked) {
    for (let [idx, item] of cardsText.entries()) {
      const pageNum = Math.trunc(idx / pageSize);
      if (pageNum > pages.length - 1) {
        pages.push(document.createElement('div'));
      }
      const newCard = document.createElement('div');
      newCard.classList.add('card');
      const text = document.createElement('div');
      let justText = item == null ? '' : item.split('	');

      text.innerHTML = `${justText[0]}: <br> ${justText[2]} <br> <br> ${justText[3]} <br> <br> ${justText[4]}`

      text.classList.add('cardText');
      newCard.appendChild(text);
      pages[pageNum].appendChild(newCard);
    }
  }
  else {
    for (let [idx, item] of cardsText.entries()) {
      const pageNum = Math.trunc(idx / pageSize);
      if (pageNum > pages.length - 1) {
        pages.push(document.createElement('div'));
      }
      const newCard = document.createElement('div');
      newCard.classList.add('card');
      const text = document.createElement('div');
      let justText = item == null ? '' : item;
      const getImages = /\<\S+\>/.exec(item);
      if (getImages != null) {
        justText = item.slice(0, getImages.index) + item.slice(getImages[0].length + getImages.index);
        const image = document.createElement('img');
        image.src = getImages[0].slice(1, -1);
        image.classList.add('cardImage');
        text.appendChild(image)
      }

      text.appendChild(document.createTextNode(justText));
      text.classList.add('cardText');
      newCard.appendChild(text);
      pages[pageNum].appendChild(newCard);
    }
  }
  for (let i of pages) {
    i.classList.add('page');
    pagesDiv.appendChild(i);
  }
}

const updatePageLimits = () => {
  textX.max = Math.ceil(pageWidthInput.value / cardColsInput.value);
  textX.min = - Math.ceil(pageWidthInput.value / cardColsInput.value);
  textY.max = Math.ceil(pageHeightInput.value / cardRowsInput.value);
  textY.min = - Math.ceil(pageHeightInput.value / cardRowsInput.value);
  cardWidthInput.max = pageWidthInput.value - (2 * pageMarginInput.value);
  cardHeightInput.max = pageHeightInput.value - (2 * pageMarginInput.value);
}

const changePageSize = () => {
  document.body.style.setProperty('--page-margin', pageMarginInput.value + 'in');
  document.body.style.setProperty('--page-width', pageWidthInput.value + 'in');
  document.body.style.setProperty('--page-height', pageHeightInput.value + 'in');
  updatePageLimits();
}

const setFromPreset = preset => {
  pageWidthInput.value = preset.width;
  pageHeightInput.value = preset.height;
  changePageSize();

  cardColsInput.value = preset.cols;
  cardRowsInput.value = preset.rows;
  cardWidthInput.value = preset.cardWidth;
  cardHeightInput.value = preset.cardHeight;
  cardGap.value = preset.gap;
  cardBorderWidth.value = preset.borderWidth;
  noPrintBorderCheck.checked = !preset.printBorders;
  cardBorderRadius.value = preset.radius;
  cardBorderColor.value = preset.borderColor;

  cardForm.dispatchEvent(new Event('input', { bubbles: true }));

  textInset.value = preset.inset;
  fontSize.value = preset.fontSize;
  boldCheck.checked = preset.bold;
  italicCheck.checked = preset.italic;
  underlineCheck.checked = preset.underline;
  justifySelect.value = preset.justify;
  vertAlignSelect.value = preset.align,
  lineSpacing.value = preset.spacing;
  fontSelect.value = preset.font;
  textColor.value = preset.textColor;
  textRotation.value = preset.rotation;
  showTextRotation.value = preset.rotation;
  textX.value = preset.x;
  showTextX.value = preset.x;
  textY.value = preset.y;
  showTextY.value = preset.y;

  textForm.dispatchEvent(new Event('input', { bubbles: true }));
}

const newPreset = name => {
  return {
    name: name,
    width: pageWidthInput.value,
    height: pageHeightInput.value,
    cols: cardColsInput.value,
    rows: cardRowsInput.value,
    cardWidth: cardWidthInput.value,
    cardHeight: cardHeightInput.value,
    gap: cardGap.value,
    borderWidth: cardBorderWidth.value,
    borderColor: cardBorderColor.value,
    printBorders: !noPrintBorderCheck.checked,
    radius: cardBorderRadius.value,
    inset: textInset.value,
    fontSize: fontSize.value,
    bold: boldCheck.checked,
    italic: italicCheck.checked,
    underline: underlineCheck.checked,
    justify: justifySelect.value,
    align: vertAlignSelect.value,
    spacing: lineSpacing.value,
    font: fontSelect.value,
    textColor: textColor.value,
    rotation: textRotation.value,
    x: textX.value,
    y: textY.value,
  }
}

const createPreset = () => {
  if (newPresetName.value === '' || !checkPresetName(newPresetName.value)) {
    return;
  }

  presets.push(newPreset(newPresetName.value));
  const newPresetOpt = document.createElement('option');
  newPresetOpt.value = presets.length - 1;
  newPresetOpt.textContent = newPresetName.value;
  presetSelect.appendChild(newPresetOpt);
  presetSelect.value = newPresetOpt.value;
  newPresetForm.classList.add('none');
  newPresetName.value = '';
}

const checkPresetName = (name, exclude = '') => {
  for (let i of presets) {
    if (name === i.name && name !== exclude) {
      sameNameWarn.classList.remove('none');
      return false;
    }
  }
  return true;
}

const resizeInputs = e => {
  e.preventDefault();
  document.body.style.setProperty('--inputs-width', e.clientX + 'px');
}

document.addEventListener('click', e => {
  if (e.target.matches('#makeCards')) {
    makeCards();
  }
  else if (e.target.matches('#print')) {
    print();
  }
  else if (e.target.matches('#clearInput') && confirm('Clear the card text input?')) {
    cardInput.value = '';
    pagesDiv.innerHTML = '';
    saveCards = '';
  }
  else if (e.target.matches('#rotatePage')) {
    [pageWidthInput.value, pageHeightInput.value] = [pageHeightInput.value, pageWidthInput.value];
    changePageSize();
  }
  else if (e.target.matches('#doBackSlash')) {
    cardInput.value = cardInput.value.replace(/(?<!(\\|\n))\n/g, '\\\n');
  }
  else if (e.target.matches('#newPresetBtn')) {
    newPresetForm.classList.remove('none');
    editPresetForm.classList.add('none');
    newPresetName.focus();
  }
  else if (e.target.matches('#createPreset')) {
    createPreset();
  }
  else if (e.target.matches('#editPresetBtn')) {
    editPresetForm.classList.remove('none');
    newPresetForm.classList.add('none');
    currentPreset = presetSelect.value;
    editPresetName.value = presets[currentPreset].name;
  }
  else if (e.target.matches('#savePreset')) {
    const getName = editPresetName.value === '' ? presets[currentPreset].name : editPresetName.value;
    if (!checkPresetName(getName, presets[currentPreset].name)) {
      return;
    }
    presetOptions[currentPreset].textContent = getName;
    presets[currentPreset] = newPreset(getName);
    editPresetForm.classList.add('none');
  }
  else if (e.target.matches('#deletePresetBtn')) {
    newPresetForm.classList.add('none');
    editPresetForm.classList.add('none');
    if (presetSelect.value === '0') {
      noDeleteWarn.classList.remove('none');
      setTimeout(() => {
        noDeleteWarn.classList.add('none');
      }, 1000);
      return;
    }
    confirmDeleteForm.classList.remove('none');
    currentPreset = presetSelect.value;
  }
  else if (e.target.matches('#realDeleteBtn')) {
    presets.splice(currentPreset, 1);
    presetOptions[currentPreset].remove();
    for (let i = 0; i < presetOptions.length; i++) { // re-index all
      presetOptions[i].value = i;
    }
    currentPreset = 0;
    confirmDeleteForm.classList.add('none');
  }
  else if (e.target.matches('.cancelBtn')) {
    newPresetName.value = '';
    editPresetName.value = '';
    newPresetForm.classList.add('none');
    editPresetForm.classList.add('none');
    confirmDeleteForm.classList.add('none');
    sameNameWarn.classList.add('none');
  }
}, false);

pageForm.addEventListener('input', changePageSize, false);

cardForm.addEventListener('input', e => {
  document.body.style.setProperty('--card-cols', cardColsInput.value);
  document.body.style.setProperty('--card-rows', cardRowsInput.value);
  switch (e.target) {
    case showCardWidth:
      cardWidthInput.value = showCardWidth.value;
      cardColsInput.value = Math.floor((pageWidthInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardWidthInput.value) + parseFloat(cardGap.value)));
    break;
    case showCardHeight:
      cardHeightInput.value = showCardHeight.value;
      cardRowsInput.value = Math.floor((pageHeightInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardHeightInput.value) + parseFloat(cardGap.value)));
    break;
    case cardColsInput:
      cardWidthInput.value = Math.trunc(((pageWidthInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardColsInput.value) + parseFloat(cardGap.value))) * 100) / 100;
      showCardWidth.value = Math.trunc(((pageWidthInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardColsInput.value) + parseFloat(cardGap.value))) * 100) / 100;
    break;
    case cardRowsInput:
      cardHeightInput.value = Math.trunc(((pageHeightInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardRowsInput.value) + parseFloat(cardGap.value))) * 100) / 100;
      showCardHeight.value = Math.trunc(((pageHeightInput.value - (2 * pageMarginInput.value)) / (parseFloat(cardRowsInput.value) + parseFloat(cardGap.value))) * 100) / 100;
    break;
  }
  cardForm.oninput();
  document.body.style.setProperty('--card-width', cardWidthInput.value + 'in');
  document.body.style.setProperty('--card-height', cardHeightInput.value + 'in');
  document.body.style.setProperty('--card-gap', cardGap.value);
  document.body.style.setProperty('--card-border-width', cardBorderWidth.value + 'px');
  document.body.style.setProperty('--card-border-color', cardBorderColor.value);
  document.body.style.setProperty('--card-border-radius', cardBorderRadius.value + 'in');
  
  updatePageLimits();
  makeCards();
}, false);

showCardWidth.addEventListener('focusout', () => {
  showCardWidth.value = cardWidthInput.value;
}, false);

showCardHeight.addEventListener('focusout', () => {
  showCardHeight.value = cardHeightInput.value;
}, false);

textForm.addEventListener('input', e => {
  document.body.style.setProperty('--text-inset', textInset.value + 'in');
  document.body.style.setProperty('--font-size', fontSize.value + 'pt');
  document.body.style.setProperty('--bold', boldCheck.checked ? 'bold' : '');
  document.body.style.setProperty('--italic', italicCheck.checked ? 'italic' : '');
  document.body.style.setProperty('--underline', underlineCheck.checked ? 'underline' : '');
  document.body.style.setProperty('--text-align', justifySelect.value);
  document.body.style.setProperty('--vert-text-align', vertAlignSelect.value);
  document.body.style.setProperty('--line-spacing', lineSpacing.value);
  document.body.style.setProperty('--font', fontSelect.value);
  document.body.style.setProperty('--text-color', textColor.value);

  if (e.target.matches('#textRotation')) {
    showTextRotation.value = textRotation.value;
  }
  else if (e.target.matches('#showTextRotation')) {
    textRotation.value = showTextRotation.value;
  }
  else if (e.target.matches('#textX')) {
    showTextX.value = textX.value;
  }
  else if (e.target.matches('#showTextX')) {
    textX.value = showTextX.value;
  }
  else if (e.target.matches('#textY')) {
    showTextY.value = textY.value;
  }
  else if (e.target.matches('#showTextY')) {
    textY.value = showTextY.value;
  }
  document.body.style.setProperty('--text-rotation', textRotation.value + 'deg');
  document.body.style.setProperty('--text-x', textX.value + 'in');
  document.body.style.setProperty('--text-y', textY.value + 'in');
}, false);

showTextRotation.addEventListener('focusout', () => {
  showTextRotation.value = textRotation.value;
}, false);

showTextX.addEventListener('focusout', () => {
  showTextX.value = textX.value;
}, false);

showTextY.addEventListener('focusout', () => {
  showTextY.value = textY.value;
}, false);

presetSelect.addEventListener('input', () => {
  setFromPreset(presets[presetSelect.value]);
  editPresetName.value = presetOptions[presetSelect.value].textContent;
  currentPreset = presetSelect.value;
}, false);

newPresetName.addEventListener('input', () => {
  sameNameWarn.classList.add('none');
}, false);

editPresetName.addEventListener('input', () => {
  sameNameWarn.classList.add('none');
}, false);

document.getElementById('inputsResizer').addEventListener('mousedown', () => {
  addEventListener('mousemove', resizeInputs, false);
}, false);

addEventListener('mouseup', () => {
  removeEventListener('mousemove', resizeInputs, false);
}, false);

addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey && document.activeElement.matches('#cardInput')) {
    makeCards();
  }
  else if (e.key === 'Enter' && document.activeElement.matches('#newPresetName')) {
    createPreset();
  }
}, false);

addEventListener('load', () => {
  cardInput.value = saveCards;
  makeCards();

  for (let [i, e] of presets.entries()) {
    const presetOpt = document.createElement('option');
    presetOpt.value = i;
    presetOpt.textContent = e.name;
    presetSelect.appendChild(presetOpt);
    /* if (e.name === 'Default') { // start on default
      presetOpt.selected = true;
    } */
    e.name === 'Territory cryptids' && (presetOpt.selected = true);
    setFromPreset(presets[presetSelect.value]);
  }
}, false);

addEventListener('beforeunload', () => {
  if (cardInput.value !== '') {
    saveCards = cardInput.value;
  }
  localStorage.setItem('cards', JSON.stringify(saveCards));
  localStorage.setItem('presets', JSON.stringify(presets));
}, false);

addEventListener('beforeprint', () => {
  const css = `@page { size: ${parseInt(pageWidthInput.value, 10) > parseInt(pageHeightInput.value, 10) ? 'landscape' : 'portrait'}; }`;
  
  const style = document.createElement('style');
  style.id = 'tempPrintStyle';
  style.type = 'text/css';
  style.media = 'print';

  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  if (noPrintBorderCheck.checked) {
    document.body.style.setProperty('--card-border-width', 0);
  }
}, false);

addEventListener('afterprint', () => {
  document.getElementById('tempPrintStyle').remove();

  if (noPrintBorderCheck.checked) {
    document.body.style.setProperty('--card-border-width', document.getElementById('cardBorderWidth').value + 'px');
  }
}, false);