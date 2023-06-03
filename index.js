const formEl = document.querySelector(".source-target");

calcInfo();

formEl.addEventListener("input", (e) => {
  calcInfo();
});

function calcInfo() {
  const formData = new FormData(formEl);

  const data = {
    sourceUnit: formData.get("source-unit"),
    targetUnit: formData.get("target-unit"),
    sourceWidth: formData.get("source-width"),
    targetWidth: formData.get("target-width"),
    sourceFontSize: formData.get("source-font-size"),
    targetFontSize: formData.get("target-font-size"),
    sourceCss: formData.get("source-css"),
    targetCss: formData.get("target-css"),
  };

  const calcInfo = getCalcInfo(data);

  const targetCssEl = document.querySelector(".output");
  targetCssEl.value = calcInfo.targetCss;
}

function getCalcInfo(data) {
  const sourceUnit = data.sourceUnit;
  const targetUnit = data.targetUnit;
  const sourceCss = data.sourceCss;

  const regex = new RegExp(
    `((\\d+)|(\\.\\d+)|(\\d+\\.)|(\\d+\\.\\d+))${sourceUnit}`,
    "g"
  );

  const targetCss = sourceCss.replaceAll(regex, (match, sourceVal) => {
    const sourceNum = Number(sourceVal);
    let sourceVw;
    if (sourceUnit === "rem") {
      sourceVw = pxToVw(
        remToPx(sourceNum, data.sourceFontSize),
        data.sourceWidth
      );
    } else if (sourceUnit === "px") {
      sourceVw = pxToVw(sourceNum, data.sourceWidth);
    } else {
      sourceVw = sourceNum;
    }

    const targetPx = vwToPx(sourceVw, data.targetWidth);
    let targetNum;
    if (targetUnit === "rem") {
      targetNum = pxToRem(targetPx, data.targetFontSize);
    } else if (targetUnit === "vw") {
      targetNum = pxToVw(targetPx, data.targetWidth);
    } else {
      targetNum = targetPx;
    }

    return `${targetNum.toPrecision(3)}${targetUnit}`;
  });

  return {
    targetCss,
  };
}

function pxToVw(px, width) {
  return (px / width) * 100;
}

function pxToRem(px, fontSize) {
  return px / fontSize;
}

function vwToPx(vw, width) {
  return (vw / 100) * width;
}

function remToPx(rem, fontSize) {
  return rem * fontSize;
}
